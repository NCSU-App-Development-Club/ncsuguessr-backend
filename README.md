# ncsuguessr backend

A TypeScript + Express app used as the backend for [ncsuguessr](https://github.com/NCSU-App-Development-Club/ncsuguessr).

# Setup

## Prerequites

You will need to install [Docker Desktop](https://www.docker.com/products/docker-desktop/) to be able to run the database and S3 (object store) locally.

## Local development

1. Install necessary dependencies using `npm install`.
2. Ensure the postgres database is running (see database setup section)
3. Start LocalStack (see S3 setup section)
4. Set necessary environment variables (see config section)
5. Run `npm run dev`, which will start the server with hot reloading

## Database setup

To start a local instance of a postgres database, run `docker run -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=ncsuguessr -p 5432:5432 postgres:17`

The above command initializes the password for the `postgres` user to be `postgres`. If you change this, be sure to also change the value of `POSTGRES_PASSWORD` in the `.env` file .

TODO: cloud-based

## S3 setup

The production deployment will use a cloud-based instance of S3, but for development, it is easier (and cheaper) to use a local deployment through [LocalStack](https://docs.localstack.cloud/overview/), which allows you to run instances of various AWS services locally.

To start an instance of LocalStack, run `docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack`

## Config

Required environment variables are given in `.env.example`. This application will attempt to load environment variables from `.env`, so before running locally, make a copy of `.env.example` and name it `.env`. If you followed the instructions given here, you should not need to change any of the values.

Environment variables prefixed with `DB*` are related to the postgres database. Those prefixed with `AWS*` are related to AWS credentials, used for connecting to and authenticating with AWS services. Those prefixed with `S3*` are related to the AWS S3 bucket that stores the location images. `DEPLOY_ENV=local` indicates that you are running this server locally and using local services.

## Running containerized

If you are simply developing/running the backend locally, you can ignore this section.

First, build the container using `docker build . -t <NAME>` from the root directory of this project (same level as this README), where `<NAME>` will be the name of your image.

Run the container (NOTE: if using local postgres, set `DB_HOST` to `host.docker.internal` on Mac and Windows) using `docker run --rm -it --env-file <ENV_FILE> -p 3000:3000 <NAME>`

TODO: how to use localstack with containerized app? (runs into networking problems)

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
