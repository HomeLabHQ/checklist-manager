USER_FIELDS = ["email", "first_name", "last_name"]


def create_user(strategy, details, backend, user=None, *args, **kwargs):
    if user:
        return {"is_new": False}
    fields = {name: kwargs.get(name, details.get(name)) for name in backend.setting("USER_FIELDS", USER_FIELDS)}
    if not fields:
        return
    social_user = strategy.create_user(**fields)
    # * It don't make sense to save user as `is_email_verified=False` when using social auth.
    social_user.save(update_fields=["is_email_verified", "email_verified_at"])
    return {"is_new": True, "user": social_user}
