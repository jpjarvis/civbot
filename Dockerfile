FROM node:19-alpine3.16 as build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY src src
COPY tsconfig.json .
RUN npm run build

FROM build as test
COPY jest.config.js .
RUN npm run test

FROM node:19-alpine3.16 as production
COPY package*.json ./
RUN npm ci --omit=dev
COPY src src
COPY tsconfig.json .
COPY --from=build /usr/src/app/build build

CMD ["npm", "start"]