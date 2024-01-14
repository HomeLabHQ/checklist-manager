from enum import Enum


class ProjectLevel(Enum):
    MVP = "Mvp"
    ENTERPRISE = "Enterprise"


class CheckListRunSectionItemStatus(Enum):
    NOT_PERFORMED = "Not Performed"
    PASSED = "Passed"
    FAILED = "Failed"


class CheckListRunStatus(Enum):
    STARTED = "Started"
    CANCELED = "Canceled"
    PAUSED = "Paused"
    PASSED = "Passed"
    FAILED = "Failed"
