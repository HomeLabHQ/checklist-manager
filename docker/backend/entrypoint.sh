#!/bin/bash
#!/usr/bin/env bash
#!/bin/sh

show_help() {
    echo """
Usage: docker-compose -f <yaml-file> run <service> COMMAND
Commands
prod      : Start django using a prod ready gunicorn server
bash      : Start a bash shell
manage    : Start manage.py
python    : Run a python command
shell     : Start a Django Python shell
celery    : Run celery
help      : Show this message
"""
}

run_setup_commands(){
  python manage.py migrate
}

case "$1" in
    prod)
        exec gunicorn core.asgi:application
    ;;
    bash)
        exec /bin/bash "${@:2}"
    ;;
    manage)
        exec python manage.py "${@:2}"
    ;;
    python)
        exec python "${@:2}"
    ;;
    shell)
        exec python manage.py shell
    ;;
    celery)
        exec celery -A core "${@:2}"
    ;;
    *)
        show_help
        exit 1
    ;;
esac
