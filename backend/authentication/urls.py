from django.urls import path

from authentication.views import (
    ObtainJSONWebToken,
    ProfileView,
    RefreshJSONWebToken,
    SignUpView,
    VerifyJSONWebToken,
)

app_name = "authentication"

urlpatterns = [
    path("", ObtainJSONWebToken.as_view(), name="auth"),
    path("refresh/", RefreshJSONWebToken.as_view(), name="auth-refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("register/", SignUpView.as_view(), name="auth-register"),
    path("verify/", VerifyJSONWebToken.as_view(), name="auth-verify"),
]
