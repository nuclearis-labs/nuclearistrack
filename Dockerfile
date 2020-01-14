FROM node:12
RUN mkdir /server
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-ts
EXPOSE 6000
CMD [ "npm", "run", "serve" ]