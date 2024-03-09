from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from drf_spectacular.utils import OpenApiResponse, extend_schema, extend_schema_view
from rest_framework import permissions
from rest_framework.exceptions import force_str
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import (
    TokenRefreshSerializer,
    TokenVerifySerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from rest_social_auth.serializers import OAuth2InputSerializer
from rest_social_auth.views import BaseSocialAuthView, SimpleJWTAuthMixin
from social_core.backends.google import GoogleOAuth2
from social_core.backends.linkedin import LinkedinOpenIdConnect

from authentication.models import User
from authentication.serializers import (
    CustomTokenObtainPairSerializer,
    JWTAuthResponseSerializer,
    JWTPairSerializer,
    SignUpConfirmSerializer,
    SignUpSerializer,
    SocialLinksSerializer,
    SocialLoginSerializer,
    UserSerializer,
)


@extend_schema_view(post=extend_schema(responses=OpenApiResponse(JWTAuthResponseSerializer)))
class ObtainJSONWebToken(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@extend_schema_view(post=extend_schema(responses=None))
class VerifyJSONWebToken(TokenVerifyView):
    serializer_class = TokenVerifySerializer


class RefreshJSONWebToken(TokenRefreshView):
    serializer_class = TokenRefreshSerializer


@extend_schema_view(post=extend_schema(responses=OpenApiResponse(JWTAuthResponseSerializer)))
class SignUpView(CreateAPIView):
    """
    Register new user in the system

    You need to provide `email`, `first_name`, `last_name`, `password`
    """

    permission_classes = (AllowAny,)
    serializer_class = SignUpSerializer


class ProfileView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return Response(UserSerializer(request.user).data)


@extend_schema_view(post=extend_schema(responses=OpenApiResponse(JWTAuthResponseSerializer)))
class SignupConfirmView(GenericAPIView):
    """Activate user account"""

    serializer_class = SignUpConfirmSerializer
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs) -> Response:
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):  # pragma: no branch
            serializer.activate_user()
            email = force_str(urlsafe_base64_decode(serializer.validated_data["token"].split(".")[0]))
            user = User.objects.get(email=email)
            token = RefreshToken.for_user(user)
        return Response(data={"access": str(token.access_token), "refresh": str(token)}, status=200)


@extend_schema_view(
    get=extend_schema(responses=OpenApiResponse(SocialLinksSerializer)),
)
class SocialLoginsView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = SocialLoginSerializer

    def get(self, request) -> Response:
        li = LinkedinOpenIdConnect(redirect_uri=f"{settings.SITE_URL}/social/linkedin-openidconnect/")
        google = GoogleOAuth2(redirect_uri=f"{settings.SITE_URL}/social/google-oauth2/")
        data = {"linkedin_openidconnect": li.auth_url(), "google_oauth2": google.auth_url()}
        return Response(data)


@extend_schema_view(post=extend_schema(responses=OpenApiResponse(JWTPairSerializer)))
@extend_schema(request=OAuth2InputSerializer)
class SocialJWTPairUserAuthView(SimpleJWTAuthMixin, BaseSocialAuthView):
    serializer_class = JWTPairSerializer
