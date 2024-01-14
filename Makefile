SHELL := /bin/bash
.DEFAULT_GOAL := help
.PHONY: help
include .env
help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sed -n 's/^\(.*\): \(.*\)##\(.*\)/\1##\3/p' \
	| column -t -s '##'
setup: ## Prepare virtual env and setup project
	cd backend && poetry install &\
	cd frontend && yarn install & \
	pre-commit install
env: ## Sync env from secret storage `make env type=staging`
	infisical export --env $(type) >.env
update: ## Update dependencies
	cd backend && poetry update && \
	cd frontend && yarn upgrade
dev: ## Start docker compose stack for development
	docker compose -f compose.dev.yml up db -d
db: ## Make migrations + Migrate
	poetry -C backend run python ./backend/manage.py makemigrations &&  poetry -C backend run python ./backend/manage.py migrate
lint: ## Lint BE+FE
	poetry -C backend run ruff . --fix --config ./backend/pyproject.toml  &&  cd frontend && npm run lint &&  npm run type-check
api: ## Regenerate api schema + rtk query slices
	poetry -C backend run ./backend/manage.py spectacular --color --file ./docs/schema.yml && \
	cd frontend && npm run api-generate
be_init: ## Run migrations + create superuser from .env
	poetry -C backend run python ./backend/manage.py migrate && \
	poetry -C backend run python ./backend/manage.py createsuperuser --no-input
coverage: ## Generate coverage report
	cd backend && coverage run ./manage.py test && coverage report -m
be_shell: ## start be shell
	poetry -C backend run ./backend/manage.py shell_plus
be_admin: ## Generate admin file for specific app `make be_admin app=items`
	poetry -C backend run ./backend/manage.py admin_generator $(app)
erd: ## Use SchemaCrawler to generate diff compatible
	docker compose -f compose.dev.yml up db crawler -d && \
	docker compose exec crawler \
	/opt/schemacrawler/bin/schemacrawler.sh \
	--server postgresql \
	--schemas=public \
	--host db \
	--port $(DB_PORT) \
	--user $(POSTGRES_USER) \
	--password $(POSTGRES_PASSWORD) \
	--command schema \
	--no-info \
	--info-level standard \
	--output-format htmlx \
	--output-file share/db.html && \
	docker compose exec crawler \
	/opt/schemacrawler/bin/schemacrawler.sh \
	--server postgresql \
	--schemas=public \
	--host db \
	--port $(DB_PORT) \
	--user $(POSTGRES_USER) \
	--password $(POSTGRES_PASSWORD) \
	--command schema \
	--no-info \
	--info-level standard \
	--output-format svg \
	--output-file share/db.svg
