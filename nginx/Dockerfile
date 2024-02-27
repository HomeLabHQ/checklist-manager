FROM node:20-slim AS build
WORKDIR /frontend
COPY ./frontend/. ./
RUN yarn install
ARG API_URL
ENV API_URL=$API_URL
ARG PUBLIC_URL
ENV PUBLIC_URL=$PUBLIC_URL


RUN yarn run build

FROM nginx:1.25

COPY --from=build /frontend/dist /usr/share/nginx/html
