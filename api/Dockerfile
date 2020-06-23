FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build-ts

CMD [ "node", "dist/index.js" ]