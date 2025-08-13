FROM node:22.18.0

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY  . .

CMD [ "yarn", "dev"]