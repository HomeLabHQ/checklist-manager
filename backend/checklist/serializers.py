from authentication.serializers import UserSerializer
from core.utils import get_deletion_ids, save_related
from django.core import validators
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from checklist.constants import CheckListCellStatus, CheckListRunSectionItemStatus, CheckListRunStatus
from checklist.models import (
    CheckList,
    CheckListCell,
    CheckListColumn,
    CheckListRow,
    CheckListRun,
    CheckListRunSection,
    CheckListRunSectionItem,
    CheckListRunSectionItemComment,
    CheckListSection,
    CheckListSectionItem,
    Project,
)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            "id",
            "title",
            "code",
            "level",
            "created_at",
            "updated_at",
        )


class BaseCheckListSerializer(serializers.ModelSerializer):
    updated_by = UserSerializer(required=False)
    created_by = UserSerializer(required=False)

    class Meta:
        model = CheckList
        fields = (
            "id",
            "title",
            "variant",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
        )


class CheckListSectionItemSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = CheckListSectionItem
        fields = (
            "id",
            "title",
            "description",
            "order",
        )


class CheckListSectionsSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, validators=[validators.MinValueValidator(limit_value=1)])
    items = CheckListSectionItemSerializer(many=True, required=False)

    class Meta:
        model = CheckListSection
        fields = (
            "id",
            "title",
            "order",
            "items",
            "description",
        )

    def create(self, data):
        items = CheckListSectionItemSerializer(many=True, data=data.pop("items", []))
        items.is_valid(raise_exception=True)
        instance = super().create(data)
        items.save(section=instance)
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        section = super().update(instance, validated_data)
        # * While PATCH user can not send these related objects.
        # * In this case we just skip update of them
        if items is not None:
            self.update_related_objects(section, "items", items, CheckListSectionItemSerializer)
        return section

    def update_related_objects(self, instance, objects_name, objects, serializer):
        deletion_ids = get_deletion_ids(getattr(instance, objects_name), objects)
        getattr(instance, objects_name).filter(id__in=deletion_ids).delete()
        save_related({"section": instance}, getattr(instance, objects_name), objects, serializer, self.context)


class CheckListRowSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, validators=[validators.MinValueValidator(limit_value=1)])

    class Meta:
        model = CheckListRow
        fields = (
            "id",
            "title",
        )


class CheckListColumnSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, validators=[validators.MinValueValidator(limit_value=1)])

    class Meta:
        model = CheckListColumn
        fields = (
            "id",
            "title",
        )


class CheckListCellSerializer(serializers.ModelSerializer):
    row = serializers.SlugRelatedField(many=True, read_only=True, slug_field="title")
    column = serializers.SlugRelatedField(many=True, read_only=True, slug_field="title")
    expected_status = serializers.ChoiceField(choices=[(v.name, v.value) for v in CheckListCellStatus], required=True)

    class Meta:
        model = CheckListCell
        fields = (
            "id",
            "row",
            "column",
            "expected_status",
        )


class CheckListSerializer(BaseCheckListSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())
    sections = CheckListSectionsSerializer(many=True, required=False)
    columns = CheckListColumnSerializer(many=True, required=False)
    rows = CheckListRowSerializer(many=True, required=False)
    cells = CheckListCellSerializer(many=True, required=False)

    class Meta(BaseCheckListSerializer.Meta):
        fields = (
            *BaseCheckListSerializer.Meta.fields,
            "project",
            "sections",
            "rows",
            "columns",
            "cells",
            "line_items",
        )

    @transaction.atomic
    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        validated_data["updated_by"] = self.context["request"].user
        rows = CheckListRowSerializer(many=True, data=validated_data.pop("rows", []))
        columns = CheckListColumnSerializer(many=True, data=validated_data.pop("columns", []))
        cells = CheckListCellSerializer(many=True, data=validated_data.pop("cells", []))
        sections = CheckListSectionsSerializer(many=True, data=validated_data.pop("sections", []))
        sections.is_valid(raise_exception=True)
        columns.is_valid(raise_exception=True)
        rows.is_valid(raise_exception=True)
        cells.is_valid(raise_exception=True)
        instance = super().create(validated_data)
        sections.save(check_list=instance)
        rows.save(check_list=instance)
        columns.save(check_list=instance)
        cells.save(check_list=instance)
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        sections = validated_data.pop("sections", None)
        rows = validated_data.pop("rows", None)
        columns = validated_data.pop("columns", None)
        validated_data["updated_by"] = self.context["request"].user
        check_list = super().update(instance, validated_data)
        # * While PATCH user can not send these related objects.
        # * In this case we just skip update of them
        if sections is not None:
            self.update_related_objects(check_list, "sections", sections, CheckListSectionsSerializer)
        if rows is not None:
            self.update_related_objects(check_list, "rows", rows, CheckListRowSerializer)
        if columns is not None:
            self.update_related_objects(check_list, "columns", columns, CheckListColumnSerializer)
        return check_list

    def update_related_objects(self, instance, objects_name, objects, serializer):
        deletion_ids = get_deletion_ids(getattr(instance, objects_name), objects)
        getattr(instance, objects_name).filter(id__in=deletion_ids).delete()
        save_related({"check_list": instance}, getattr(instance, objects_name), objects, serializer, self.context)


class CheckListRunSectionItemCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckListRunSectionItemComment
        fields = (
            "id",
            "item",
            "message",
        )

    def create(self, validated_data):
        """Modify save method to automatically fail checklist item"""
        instance = super().create(validated_data)
        instance.item.status = CheckListRunSectionItemStatus.FAILED.name
        instance.item.save(update_fields=["status"])
        instance.item.section.check_list_run.updated_at = timezone.now()
        instance.item.section.check_list_run.save(update_fields=["updated_at"])
        return instance


class CheckListRunSectionItemSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=[(v.name, v.value) for v in CheckListRunSectionItemStatus], required=True)
    comments = CheckListRunSectionItemCommentSerializer(required=False, many=True)

    class Meta:
        model = CheckListRunSectionItem
        fields = (
            "id",
            "title",
            "description",
            "status",
            "comments",
            "order",
        )

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        instance.section.check_list_run.updated_at = timezone.now()
        instance.section.check_list_run.save(update_fields=["updated_at"])
        return instance


class CheckListRunSectionSerializer(serializers.ModelSerializer):
    items = CheckListRunSectionItemSerializer(many=True, required=False)

    class Meta:
        model = CheckListRunSection
        fields = (
            "id",
            "title",
            "description",
            "order",
            "items",
            "progress",
        )


class CheckListRunSerializer(serializers.ModelSerializer):
    sections = CheckListRunSectionSerializer(many=True, required=False)
    checklist = serializers.CharField(source="check_list.title")
    status = serializers.ChoiceField(choices=[(v.name, v.value) for v in CheckListRunStatus], required=True)
    created_by = UserSerializer(required=False)
    updated_by = UserSerializer(required=False)
    duration = serializers.IntegerField()

    class Meta:
        model = CheckListRun
        fields = (
            "id",
            "checklist",
            "created_by",
            "created_at",
            "updated_by",
            "updated_at",
            "status",
            "duration",
            "progress",
            "finished_at",
            "sections",
            "line_items",
            "failed",
            "passed",
        )

    def update(self, instance, validated_data) -> CheckListRun:
        if validated_data.get("status") in [
            CheckListRunStatus.PASSED.name,
            CheckListRunStatus.FAILED.name,
            CheckListRunStatus.CANCELED.name,
        ]:
            validated_data["finished_at"] = timezone.now()
        else:
            validated_data["finished_at"] = None
        validated_data["updated_by"] = self.context["request"].user
        validated_data["updated_at"] = timezone.now()
        instance = super().update(instance, validated_data)
        return instance


class CheckListRunStatisticSerializer(serializers.Serializer):
    average_duration = serializers.IntegerField()
    total_duration = serializers.IntegerField()
    total = serializers.IntegerField(default=0)
    passed = serializers.IntegerField(default=0)
    started = serializers.IntegerField(default=0)
    failed = serializers.IntegerField(default=0)
