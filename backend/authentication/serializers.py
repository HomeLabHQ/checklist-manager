from core.tasks import send_email
from core.tokens import TokenGenerator
from core.utils import create_url
from django.conf import settings
from django.db import transaction
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers
from rest_framework.exceptions import force_str
from rest_framework.test import force_bytes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_social_auth.serializers import JWTBaseSerializer

from authentication.models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        attrs["email"] = attrs["email"].lower()
        return super().validate(attrs)


class JWTAuthResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class SignUpSerializer(serializers.ModelSerializer):
    """Create new user when sign up"""

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "password",
        )
        write_only_fields = ("password",)

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email=value).exists():
            error = f"User with the email '{value}' already exists"
            raise serializers.ValidationError(error)
        return value

    @transaction.atomic
    def create(self, validated_data):
        first_name = validated_data.pop("first_name", "")
        last_name = validated_data.pop("last_name", "")
        user = User.objects.create(
            email=validated_data["email"],
            first_name=first_name,
            last_name=last_name,
            is_active=False,
        )
        user.set_password(validated_data["password"])
        user.save()
        token = f"{urlsafe_base64_encode(force_bytes(user.email))}.{TokenGenerator.make_token(user)}"
        template = "notifications/signup.email.html"
        url = create_url(f"{settings.SITE_URL}/signup/confirm", token)
        send_email.delay(
            subject="Welcome",
            template=template,
            recipients=[user.email],
            context={
                "url": url,
                "email": user.email,
            },
        )
        return user

    def to_representation(self, instance):
        data = {}
        refresh = TokenObtainPairSerializer.get_token(instance)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "email",
            "first_name",
            "last_name",
        )


class SignUpConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, data):
        token = data["token"]
        error = f"Provided activation token '{token}' is not valid"
        try:
            uid, token = token.split(".")
            uid = force_str(urlsafe_base64_decode(uid))
        except (TypeError, ValueError):
            raise serializers.ValidationError(error)
        try:
            user = User.objects.get(email=uid)
        except User.DoesNotExist:
            raise serializers.ValidationError(error)

        if not TokenGenerator.check_token(user, token):
            raise serializers.ValidationError(error)
        data["email"] = uid
        return data

    def activate_user(self):
        user = User.objects.get(email=self.validated_data["email"])
        user.is_active = True
        user.save()


class SocialLinksSerializer(serializers.Serializer):
    linkedin_openidconnect = serializers.URLField(required=False)
    google_oauth2 = serializers.URLField(required=False)


class SocialLoginSerializer(serializers.Serializer):
    provider = serializers.CharField()
    code = serializers.CharField()


class JWTPairSerializer(JWTBaseSerializer):
    access = serializers.SerializerMethodField()
    refresh = serializers.SerializerMethodField()

    jwt_token_class_name = "rest_framework_simplejwt.tokens.RefreshToken"

    def get_access(self, obj):
        return str(self.get_token_instance().access_token)

    def get_refresh(self, obj):
        return str(self.get_token_instance())
