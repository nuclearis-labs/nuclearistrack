FROM node:latest
RUN mkdir /client
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]