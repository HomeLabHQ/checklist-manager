import typing

from core.models import TimeStampedModel, TitleDescriptionModel, TitleModel
from django.db import models

from checklist.constants import (
    CheckListCellStatus,
    CheckListRunSectionItemStatus,
    CheckListRunStatus,
    CheckListTemplateVariant,
    ProjectLevel,
)


class Project(TitleModel, TimeStampedModel):
    code = models.CharField(max_length=4, unique=True)
    level = models.CharField(
        max_length=255,
        choices=[(v.name, v.value) for v in ProjectLevel],
        default=ProjectLevel.MVP.name,
    )

    class Meta:
        db_table = "projects"
        verbose_name = "Project"
        verbose_name_plural = "Projects"
        ordering: typing.ClassVar = ["-created_at"]

    def __str__(self) -> str:
        return self.code


class CheckList(TitleModel, TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="check_lists")
    variant = models.CharField(
        max_length=255,
        choices=[(v.name, v.value) for v in CheckListTemplateVariant],
        default=CheckListTemplateVariant.LINEAR.name,
    )
    updated_by = models.ForeignKey(
        "authentication.User", on_delete=models.SET_NULL, null=True, related_name="check_lists_updated"
    )
    created_by = models.ForeignKey(
        "authentication.User", on_delete=models.SET_NULL, null=True, related_name="check_lists_created"
    )

    class Meta:
        db_table = "checklists"
        verbose_name = "CheckLists"
        verbose_name_plural = "CheckLists"

    @property
    def line_items(self) -> int:
        match self.variant:
            case CheckListTemplateVariant.LINEAR.name:
                return sum(section.items.all().count() for section in self.sections.all())
            case CheckListTemplateVariant.TABULAR.name:
                return self.rows.all().count() * self.columns.all().count()
            case _:
                return 0

    def __str__(self) -> str:
        return self.title


class CheckListRow(TitleModel):
    check_list = models.ForeignKey(CheckList, on_delete=models.CASCADE, related_name="rows")

    class Meta:
        db_table = "checklist-rows"
        verbose_name = "CheckListRow"
        verbose_name_plural = "CheckListRows"
        unique_together = (("title", "check_list"),)


class CheckListColumn(TitleModel):
    check_list = models.ForeignKey(CheckList, on_delete=models.CASCADE, related_name="columns")

    class Meta:
        db_table = "checklist-columns"
        verbose_name = "CheckListColumn"
        verbose_name_plural = "CheckListColumns"
        unique_together = (("title", "check_list"),)


class CheckListCell(models.Model):
    row = models.ForeignKey(CheckListRow, on_delete=models.CASCADE, related_name="cells")
    colum = models.ForeignKey(CheckListColumn, on_delete=models.CASCADE, related_name="cells")
    check_list = models.ForeignKey(CheckList, on_delete=models.CASCADE, related_name="cells")
    expected_status = models.CharField(
        max_length=255,
        choices=[(v.name, v.value) for v in CheckListCellStatus],
        default=CheckListCellStatus.NOT_PERFORMED.name,
    )

    class Meta:
        db_table = "checklist-cells"
        verbose_name = "CheckListCell"
        verbose_name_plural = "CheckListCells"


class CheckListSection(TitleDescriptionModel):
    check_list = models.ForeignKey(CheckList, on_delete=models.CASCADE, related_name="sections")
    order = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "checklist_sections"
        verbose_name = "CheckListSection"
        verbose_name_plural = "CheckListSections"

    def __str__(self) -> str:
        return self.title


class CheckListSectionItem(TitleDescriptionModel):
    section = models.ForeignKey(CheckListSection, on_delete=models.CASCADE, related_name="items")
    order = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "checklist_sections_items"
        verbose_name = "CheckListSectionItem"
        verbose_name_plural = "CheckListSectionsItems"

    def __str__(self) -> str:
        return self.title


class CheckListRun(models.Model):
    check_list = models.ForeignKey(CheckList, on_delete=models.CASCADE, related_name="runs")
    created_by = models.ForeignKey(
        "authentication.User", on_delete=models.CASCADE, null=True, related_name="created_runs"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_by = models.ForeignKey(
        "authentication.User", on_delete=models.CASCADE, null=True, related_name="updated_runs"
    )
    updated_at = models.DateTimeField(null=True)
    finished_at = models.DateTimeField(null=True)
    status = models.CharField(
        max_length=255,
        choices=[(v.name, v.value) for v in CheckListRunStatus],
        default=CheckListRunStatus.STARTED.name,
    )
    duration = models.IntegerField(default=0)

    class Meta:
        db_table = "checklist_runs"
        verbose_name = "CheckListRun"
        verbose_name_plural = "CheckListRuns"

    @property
    def progress(self) -> int:
        sections = self.sections.all()
        total = 0
        finished = 0
        for section in sections:
            total += section.items.count()
            finished += section.items.filter(
                models.Q(status=CheckListRunSectionItemStatus.PASSED.name)
                | models.Q(status=CheckListRunSectionItemStatus.FAILED.name),
            ).count()
        return round((finished / total) * 100) if total else 0

    @property
    def failed(self) -> int:
        return self.sections.filter(items__status=CheckListRunSectionItemStatus.FAILED.name).count()

    @property
    def passed(self) -> int:
        return self.sections.filter(items__status=CheckListRunSectionItemStatus.PASSED.name).count()

    @property
    def line_items(self) -> int:
        return sum(section.items.all().count() for section in self.sections.all())


class CheckListRunSection(TitleDescriptionModel):
    check_list_run = models.ForeignKey(CheckListRun, on_delete=models.CASCADE, related_name="sections")
    order = models.PositiveIntegerField(default=1)

    class Meta:
        db_table = "checklist_run_sections"
        verbose_name = "CheckListRunSection"
        verbose_name_plural = "CheckListRunSections"

    @property
    def progress(self) -> int:
        finished = self.items.filter(
            models.Q(status=CheckListRunSectionItemStatus.PASSED.name)
            | models.Q(status=CheckListRunSectionItemStatus.FAILED.name),
        ).count()
        return round((finished / total) * 100) if (total := self.items.count()) else 0


class CheckListRunSectionItem(TitleDescriptionModel):
    section = models.ForeignKey(CheckListRunSection, on_delete=models.CASCADE, related_name="items")
    order = models.PositiveIntegerField(default=1)
    status = models.CharField(
        max_length=255,
        choices=[(v.name, v.value) for v in CheckListRunSectionItemStatus],
        default=CheckListRunSectionItemStatus.NOT_PERFORMED.name,
    )

    class Meta:
        db_table = "checklist_run_sections_items"
        verbose_name = "CheckListRunSectionItem"
        verbose_name_plural = "CheckListRunSectionsItems"


class CheckListRunSectionItemComment(models.Model):
    item = models.ForeignKey(CheckListRunSectionItem, on_delete=models.CASCADE, related_name="comments")
    message = models.TextField()

    class Meta:
        db_table = "checklist_run_sections_item_comments"
        verbose_name = "CheckListRunSectionItemComment"
        verbose_name_plural = "CheckListRunSectionsItemComments"
