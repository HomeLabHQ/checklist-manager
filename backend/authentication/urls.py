from django.urls import path, re_path

from authentication.views import (
    ObtainJSONWebToken,
    ProfileView,
    RefreshJSONWebToken,
    SignupConfirmView,
    SignUpView,
    SocialJWTPairUserAuthView,
    SocialLoginsView,
    VerifyJSONWebToken,
)

app_name = "authentication"

urlpatterns = [
    path("", ObtainJSONWebToken.as_view(), name="auth"),
    path("refresh/", RefreshJSONWebToken.as_view(), name="auth-refresh"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("register/", SignUpView.as_view(), name="auth-register"),
    path("register/confirm/", SignupConfirmView.as_view(), name="auth-confirm"),
    path("verify/", VerifyJSONWebToken.as_view(), name="auth-verify"),
    path("social-logins/", SocialLoginsView.as_view(), name="social-logins"),
    re_path(
        r"^social/jwt-pair/(?:(?P<provider>[a-zA-Z0-9_-]+)/?)?$",
        SocialJWTPairUserAuthView.as_view(),
        name="social-login",
    ),
]
