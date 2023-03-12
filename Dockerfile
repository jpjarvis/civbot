FROM node:19-alpine3.16 as base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY src src
COPY tsconfig.json .
RUN npm build

FROM base as test
COPY jest.config.js .
RUN npm test

FROM node:19-alpine3.16 as production
COPY package*.json ./
RUN npm ci --omit=dev
COPY src src
COPY tsconfig.json .
COPY from=base /usr/src/app/dist

CMD ["npm", "start"]