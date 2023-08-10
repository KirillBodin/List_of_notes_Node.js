FROM node:18.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript ts-node

RUN npm install

COPY . .

EXPOSE 3000

CMD ["ts-node", "src/index.ts"]
