from enum import Enum


class ProjectLevel(Enum):
    MVP = "Mvp"
    ENTERPRISE = "Enterprise"


class CheckListRunSectionItemStatus(Enum):
    NOT_PERFORMED = "Not Performed"
    PASSED = "Passed"
    FAILED = "Failed"


class CheckListCellStatus(Enum):
    NOT_PERFORMED = "Not Performed"
    PASSED = "Passed"
    FAILED = "Failed"


class CheckListTemplateVariant(Enum):
    LINEAR = "Linear"
    TABULAR = "Tabular"


class CheckListRunStatus(Enum):
    STARTED = "Started"
    CANCELED = "Canceled"
    PAUSED = "Paused"
    PASSED = "Passed"
    FAILED = "Failed"
