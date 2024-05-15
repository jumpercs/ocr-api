FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN mkdir /app/uploads

COPY . .

EXPOSE 7000

CMD [ "npm", "start" ]
