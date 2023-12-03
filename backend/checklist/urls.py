from rest_framework.routers import SimpleRouter

from checklist.views import (
    CheckListRunSectionItemCommentViewSet,
    CheckListRunSectionItemViewSet,
    CheckListRunViewSet,
    CheckListViewSet,
    ProjectViewSet,
)

app_name = "qualitet"
router = SimpleRouter()
router.register("project", ProjectViewSet, basename="projects")
router.register("checklist", CheckListViewSet, basename="checklists")
router.register("checklist-run", CheckListRunViewSet, basename="checklist-runs")
router.register("checklist-run-items", CheckListRunSectionItemViewSet, basename="checklist-run-items")
router.register(
    "checklist-run-item-comments",
    CheckListRunSectionItemCommentViewSet,
    basename="checklist-run-item-comments",
)
urlpatterns = [*router.urls]
