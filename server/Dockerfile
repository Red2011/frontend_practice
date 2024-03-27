FROM node:20


WORKDIR /server

COPY . .

RUN npm install


RUN npm run build

CMD [ "node", "dist/src/main.js" ]



