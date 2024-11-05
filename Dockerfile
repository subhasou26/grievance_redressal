FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
FROM python:3.9-slim
RUN apt-get update && apt-get install -y bash
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install



COPY . .
EXPOSE 5000

# CMD ["node","index.js"]
