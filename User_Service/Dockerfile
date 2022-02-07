FROM node:14.11.0

WORKDIR /usr/src/app

COPY ./package.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["node", "server.js"]