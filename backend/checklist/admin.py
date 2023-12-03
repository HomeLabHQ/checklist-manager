from django.contrib import admin

from .models import (
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


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "created_at",
        "updated_at",
        "title",
        "code",
        "level",
    )
    list_filter = ("created_at", "updated_at")
    date_hierarchy = "created_at"


@admin.register(CheckList)
class CheckListAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "created_at",
        "updated_at",
        "title",
        "project",
        "variant",
        "updated_by",
        "created_by",
    )
    list_filter = (
        "created_at",
        "updated_at",
        "project",
        "updated_by",
        "created_by",
    )
    date_hierarchy = "created_at"


@admin.register(CheckListRow)
class CheckListRowAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "check_list")
    list_filter = ("check_list",)


@admin.register(CheckListColumn)
class CheckListColumnAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "check_list")
    list_filter = ("check_list",)


@admin.register(CheckListCell)
class CheckListCellAdmin(admin.ModelAdmin):
    list_display = ("id", "row", "colum", "check_list", "expected_status")
    list_filter = ("row", "colum", "check_list")


@admin.register(CheckListSection)
class CheckListSectionAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "title", "check_list", "order")
    list_filter = ("check_list",)


@admin.register(CheckListSectionItem)
class CheckListSectionItemAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "title", "section", "order")
    list_filter = ("section",)


@admin.register(CheckListRun)
class CheckListRunAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "check_list",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
        "finished_at",
        "status",
        "duration",
    )
    list_filter = (
        "check_list",
        "created_by",
        "created_at",
        "updated_by",
        "updated_at",
        "finished_at",
    )
    date_hierarchy = "created_at"


@admin.register(CheckListRunSection)
class CheckListRunSectionAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "title", "check_list_run", "order")
    list_filter = ("check_list_run",)


@admin.register(CheckListRunSectionItem)
class CheckListRunSectionItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "description",
        "title",
        "section",
        "order",
        "status",
    )
    list_filter = ("section",)


@admin.register(CheckListRunSectionItemComment)
class CheckListRunSectionItemCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "item", "message")
    list_filter = ("item",)
