import logging

from celery import shared_task
from celery.exceptions import MaxRetriesExceededError
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

logger = logging.getLogger("celery")


@shared_task(bind=True, max_retries=3)
def send_email(self, subject: str, template: str, recipients: list, context: dict, reply_to=None):
    """
    Sending emails
    :param self: task object
    :param subject: message title
    :param context: message data in dict format
    :param template: name of template
    :param recipients: list of receivers
    :param reply_to: email to reply (default=None)
    :return:
    """
    html_message = render_to_string(template, context)
    try:
        send_mail(
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=recipients,
            subject=subject,
            message=subject,
            html_message=html_message,
        )
    except Exception as error:
        logger.error(f"Connection error occurred while sending of email. Code: {error} - Message: {error}")
        try:
            self.retry(countdown=60)
        except MaxRetriesExceededError as e:
            logger.error(str(e))
