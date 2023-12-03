from authentication.models import User

from checklist.models import CheckList, CheckListRun, CheckListRunSection, CheckListRunSectionItem


def run_checklist(checklist: CheckList, user: User) -> CheckListRun:
    """run_checklist

    Create CheckListRun instance based on current checklist and user

    Args:
        checklist (CheckList): _description_

    Returns:
        CheckListRun: _description_
    """
    run = CheckListRun.objects.create(check_list=checklist, created_by=user)
    for section in checklist.sections.all():
        run_section = CheckListRunSection.objects.create(
            title=section.title,
            description=section.description,
            order=section.order,
            check_list_run=run,
        )
        for item in section.items.all():
            CheckListRunSectionItem.objects.create(
                section=run_section,
                title=item.title,
                description=item.description,
                order=item.order,
            )
    return run
