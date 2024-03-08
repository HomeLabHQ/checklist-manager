import logging
import typing

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import QuerySet
from rest_framework import serializers

logger = logging.getLogger("django")


def save_related(
    base: dict,
    queryset: QuerySet,
    validated_data: dict,
    related_serializer_class: typing.Type[serializers.Serializer],
    context: dict | None = None,
):
    """Save related serializer based on base serializer data

    :param base: base info to pass in related serializer's ``.save(**base)`` method
    :param queryset: queryset to get object from
    :param validated_data: validated data
    :param related_serializer_class: related serializer class
    :param context: parent serializer's context

    :return list of created objects
    """
    response = []
    for v in validated_data:
        id_ = v.pop("id", None)
        if id_:
            try:
                obj = queryset.get(id=id_)
            except ObjectDoesNotExist:
                logger.warning(f"Object (asset) with ID {id_} is not found in db. Skipping.")
                continue
        else:
            obj = None
        related_serializer = related_serializer_class(data=v, instance=obj, context=context)
        related_serializer.is_valid(raise_exception=True)
        obj = related_serializer.save(**base)
        response.append(obj)
    return response


def get_deletion_ids(queryset: QuerySet, validated_data: list, lookup_field: str = "id") -> list:
    """Get IDs for queryset that must be deleted from queryset.
    i. e. IDs that are not present in validated_data but present in queryset

    :param queryset: queryset object
    :param validated_data: validated data to find IDs in
    :param lookup_field: what field to use when retrieving deletion ID
    :return: list of IDs for deletion
    """
    model_set = set(queryset.values_list(lookup_field, flat=True))
    values_set = {v[lookup_field] for v in validated_data if lookup_field in v}
    return list(model_set.difference(values_set))


def create_url(relative_url: str, token: str) -> str:
    """Generate full URL based on relative url and token
    :param relative_url: relative url
    :param token: token
    :return: url
    """
    return f"{relative_url.strip('/')}?token={token}"
