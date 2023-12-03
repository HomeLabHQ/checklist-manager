from django_filters import rest_framework as filters

from checklist.models import CheckList, CheckListRun


class CheckListFilter(filters.FilterSet):
    project = filters.CharFilter(field_name="project__code", lookup_expr="iexact")

    class Meta:
        model = CheckList
        fields = ("project",)


class CheckListRunFilter(filters.FilterSet):
    project = filters.CharFilter(field_name="check_list__project__code", lookup_expr="iexact")

    class Meta:
        model = CheckListRun
        fields = ("project",)
