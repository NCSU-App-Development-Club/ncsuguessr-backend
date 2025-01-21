FROM node:22.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY tsconfig.json .
COPY src src

EXPOSE 3000

RUN npm run build
CMD ["npm", "run", "start"]
