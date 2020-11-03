FROM node:12
WORKDIR /app
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn install
COPY . /app/
EXPOSE 3000
COPY wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh