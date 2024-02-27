<a name="readme-top"></a>

[![LinkedIn][linkedin-shield]][linkedin-url]
<br />
[![TimeSpent][Wakatime-shield]][Wakatime-shield]
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=HomeLabHQ_checklist-manager&metric=coverage)](https://sonarcloud.io/summary/new_code?id=HomeLabHQ_checklist-manager)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=HomeLabHQ_checklist-manager&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=HomeLabHQ_checklist-manager)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=HomeLabHQ_checklist-manager&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=HomeLabHQ_checklist-manager)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=HomeLabHQ_checklist-manager&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=HomeLabHQ_checklist-manager)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=HomeLabHQ_checklist-manager&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=HomeLabHQ_checklist-manager)
[![Ruff](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/astral-sh/ruff/main/assets/badge/v2.json)](https://github.com/astral-sh/ruff)

<div align="center">
  <h3 align="center">Checklist manager</h3>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#db-schema">DB Schema</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

## About The Project

Main goal of this project is to provide a checklist manager for QA team to quickly run regression tests.

<p align="right"><a href="#readme-top">⬆️</a></p>

### Built With

[![Django][Django]][Django-url]
[![React][React.js]][React-url]
[![Redux][Redux]][Redux-url]
[![Vite][Vite]][Vite-url]

<p align="right"><a href="#readme-top">⬆️</a></p>

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

For local development you will need:

- Python 3.12.0
- Node 20.11.1
  - Yarn 4.0.2

Also strongly recommend using tools like nvm and pyenv for running specific versions of Python and Node for this project

> NOTE: Additionally install poetry self add poetry-dotenv-plugin to auto load env variables in shell and run command

### Installation

1. Run `make setup`
2. Initialize backend via `make be_init`
   - Creates superuser from .env variables
   - Run migrations

<p align="right"><a href="#readme-top">⬆️</a></p>

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/oleksandr-korol/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[antd-url]: https://ant.design/
[redux]: https://img.shields.io/badge/Redux%20toolkit-20232A?style=for-the-badge&logo=redux&logoColor=61DAFB
[redux-url]: https://reactjs.org/
[Vite]: https://img.shields.io/badge/Vite-20232A?style=for-the-badge&logo=vite&logoColor=61DAFB
[Vite-url]: https://vitejs.dev/
[Django]: https://img.shields.io/badge/Django-20232A?style=for-the-badge&logo=django&logoColor=61DAFB
[Django-url]: https://www.djangoproject.com/
[Wakatime-shield]: https://wakatime.com/badge/user/b235aad2-892a-4e83-b8c3-a6cc36bc4cf4/project/4f0e2abd-fe10-4685-a3a1-6873f55853fa.svg
