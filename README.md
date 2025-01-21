# ncsuguessr backend

A TypeScript + Express app used as the backend for [ncsuguessr](https://github.com/NCSU-App-Development-Club/ncsuguessr).

## Local development

1. Install necessary dependencies using `npm install`.
2. Ensure the database is running (see database setup section)
3. Set necessary environment variables (see config section)
4. Start LocalStack (see S3 setup section)
5. Run `npm run dev`, which will start the server with hot reloading

## Database setup

Local: install [Docker Desktop](https://www.docker.com/products/docker-desktop/), then pull and run the official [postgres image](https://hub.docker.com/_/postgres). The default username is `postgres`, and you can specify a password by setting the `POSTGRES_PASSWORD` environment variable.

TODO: cloud-based

## S3 setup

The production deployment will use a cloud-based instance of S3, but for development, it is easier (and cheaper) to use a local deployment through [LocalStack](https://docs.localstack.cloud/overview/), which allows you to run instances of various AWS services locally.

To start an instance of LocalStack, run `docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack`. Alternatively, you can use docker desktop, but be sure to map all ports.

## Config

Required environment variables are given in `.env.example`. The server will attempt to read environment variables from `.env`, so before running locally, make a copy of `.env.example`, name it `.env`, and fill in the required variables.

Environment variables prefixed with `DB*` are related to the postgres database. Those prefixed with `AWS*` are related to AWS credentials, used for connecting to and authenticating with AWS services. Those prefixed with `S3*` are related to the AWS S3 bucket that stores the location images.

## Running containerized

First, build the container using `docker build . -t <NAME>` from the root directory of this project (same level as this README), where `<NAME>` will be the name of your image.

Run the container (NOTE: if using local postgres, set `DB_HOST` to `host.docker.internal` on Mac and Windows) using `docker run --rm -it --env-file <ENV_FILE> -p 3000:3000 <NAME>`

TODO: how to use localstack with containerized app? (runs into networking problems)
