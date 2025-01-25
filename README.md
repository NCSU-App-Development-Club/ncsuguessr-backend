# ncsuguessr backend

A TypeScript + Express app used as the backend for [ncsuguessr](https://github.com/NCSU-App-Development-Club/ncsuguessr).

# Setup

## Prerequisites

You will need to install [Docker Desktop](https://www.docker.com/products/docker-desktop/) to be able to run the database and S3 (object store) locally.

## Local development

1. Ensure that you have the [Prettier extension for vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) installed. This will automatically format your code whenver you save a file.
2. Make sure your `node` version is correct by running `nvm use` from the root of this repository (same level as this README). If you do not have `nvm` installed, see the below section on `nvm`
3. Install necessary dependencies using `npm install`
4. Start Docker Desktop (must be running to use the docker CLI commands)
5. Start a local instances of Postgres and LocalStack bu running the following command: `docker compose up`
6. Set necessary environment variables (see config section)
7. Run `npm run dev`, which will start the server with hot reloading

## Local Docker Setup

We will be using Docker Compose for our local development environment. To view the configuration, see compose.yaml.

Running `docker compose up` will start two containers: one for Postgres, and one for S3.

<!-- To start a local instance of a postgres database, run `docker run -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ncsuguessr -p 5432:5432 postgres:17`. -->

The Postgres container will be using Postgres version 17--this is what will be used in production, and it is best to keep development and production environments as similar as possible. The password for the `postgres` user will be set to `postgres`.

TODO: cloud-based

The production deployment will use a cloud-based instance of S3, but for development, it is easier (and cheaper) to use a local deployment through [LocalStack](https://docs.localstack.cloud/overview/), which allows you to run instances of various AWS services locally.
Docker Compose will set this up for you.

## Config

Required environment variables are given in `.env.example`. This application will attempt to load environment variables from `.env`, so before running locally, make a copy of `.env.example` and name it `.env`. If you followed the instructions given here, you should not need to change any of the values.

Environment variables prefixed with `DB*` are related to the Postgres database. Those prefixed with `AWS*` are related to AWS credentials, used for connecting to and authenticating with AWS services. Those prefixed with `S3*` are related to the AWS S3 bucket that stores the location images. `DEPLOY_ENV=local` indicates that you are running this server locally and using local services.

## Running containerized

If you are simply developing/running the backend locally, you can ignore this section.

First, build the container using `docker build . -t <NAME>` from the root directory of this project (same level as this README), where `<NAME>` will be the name of your image.

Run the container (NOTE: if using local postgres, set `DB_HOST` to `host.docker.internal` on Mac and Windows) using `docker run --rm -it --env-file <ENV_FILE> -p 3000:3000 <NAME>`

TODO: how to use localstack with containerized app? (runs into networking problems)

## NVM

`nvm`, or node version manager, is a command line utility that helps install and manage multiple versions of node. We will be using it to ensure that everyone is using the same version of node. Please use [this guide](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) to install `nvm` (or `nvm-windows` if you are on windows, but it should work the same).

Not required, but if you are using zsh (default on mac, can be installed on linux), you can set up automatic `nvm` version switching. See [here](https://github.com/nvm-sh/nvm#zsh)

# File structure

## `src/`

This contains all of the source code for the backend

`src/index.ts` contains the main entrypoint; this is what will be started when you run `npm run dev`.

## `src/util`

This contains miscellaneous utility functions, including AWS client code.

## `src/routes`

This contains the express routes, which directly handle requests and generate responses.

## `src/repository`

This contains a collection of functions, each of which is responsible for getting data from the database via a SQL query

`src/repository/index.ts` contains code that initializes the database client.

## `src/models`

This contains data models used for inserting data into the database and retrieving data from the database

## `src/dto`

Similar to `src/models`, but this contains models used when interacting directly with requests--i.e. models that represent requests that may be received, or responses that may be sent.
