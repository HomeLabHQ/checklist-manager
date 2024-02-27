from core.mixins import IdSerializer
from django.contrib.auth.models import AnonymousUser
from django.db.models import Avg, Count, Prefetch, Sum
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from checklist.filters import CheckListFilter, CheckListRunFilter
from checklist.models import (
    CheckList,
    CheckListRun,
    CheckListRunSection,
    CheckListRunSectionItem,
    CheckListRunSectionItemComment,
    CheckListSection,
    CheckListSectionItem,
    Project,
)
from checklist.serializers import (
    CheckListRunSectionItemCommentSerializer,
    CheckListRunSectionItemSerializer,
    CheckListRunSerializer,
    CheckListRunStatisticSerializer,
    CheckListSerializer,
    ProjectSerializer,
)
from checklist.utils import run_checklist


class ProjectViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProjectSerializer
    lookup_field = "code"

    def get_queryset(self):
        if self.request.user is AnonymousUser:
            return Project.objects.none()
        else:
            return self.request.user.projects.all()


class CheckListViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = CheckListSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = CheckListFilter
    queryset = CheckList.objects.prefetch_related(
        Prefetch("sections", queryset=CheckListSection.objects.order_by("order")),
        Prefetch("sections__items", queryset=CheckListSectionItem.objects.order_by("order")),
    ).order_by("-id")

    @extend_schema(operation_id="Run checklist", request=None, responses=IdSerializer)
    @action(detail=True, methods=["POST"])
    def run(self, request, pk=None) -> Response:
        """run

        This method generate regression instance for current user and template

        """
        checklist = self.get_object()
        run = run_checklist(checklist, self.request.user)
        return Response({"id": run.id})


class CheckListRunViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = CheckListRunSerializer
    filter_backends = (DjangoFilterBackend,)
    filterset_class = CheckListRunFilter
    queryset = CheckListRun.objects.prefetch_related(
        Prefetch("sections", queryset=CheckListRunSection.objects.order_by("order")),
        Prefetch("sections__items", queryset=CheckListRunSectionItem.objects.order_by("order")),
    ).order_by("-id")

    @extend_schema(filters=True)
    @action(
        detail=False,
        methods=["GET"],
        serializer_class=CheckListRunStatisticSerializer,
        pagination_class=None,
    )
    def statistic(self, *args, **kwargs) -> Response:
        """statistic

        Get statistic data for checklists run
        """
        data = self.queryset.filter(duration__gt=0).aggregate(
            average_duration=Avg("duration"),
            total_duration=Sum("duration"),
            total=Count("id"),
        )
        data_statuses = self.queryset.values("status").annotate(count=Count("status"))
        for status in data_statuses:
            data[status["status"].lower()] = status["count"]
        return Response(status=200, data=CheckListRunStatisticSerializer(data).data)


class CheckListRunSectionItemViewSet(
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = CheckListRunSectionItemSerializer
    queryset = CheckListRunSectionItem.objects.all().order_by("id")


class CheckListRunSectionItemCommentViewSet(
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthenticated,)
    serializer_class = CheckListRunSectionItemCommentSerializer
    queryset = CheckListRunSectionItemComment.objects.all().order_by("id")
