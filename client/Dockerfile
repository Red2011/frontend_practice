FROM node:20


WORKDIR /client


RUN apt-get update && apt-get install -y \
    net-tools \
    curl


COPY . .

RUN npm install

RUN npm run build

ENV API_URL my-api:5000


CMD [ "npm", "start"]



