FROM node:12
RUN mkdir /server
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g truffle
RUN npm run build-ts
RUN truffle compile
EXPOSE 6000
CMD [ "npm", "start" ]