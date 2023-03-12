FROM node:19-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY src src
COPY tsconfig.json .

CMD ["npm", "start"]