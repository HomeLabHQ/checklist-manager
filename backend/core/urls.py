from django.contrib import admin
from django.urls import include, path

# from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

api_urlpatterns = [
    path("auth/", include("authentication.urls")),
    path("checklist/", include("checklist.urls")),
]
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(api_urlpatterns)),
    # path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    # path("api/swagger-ui/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
