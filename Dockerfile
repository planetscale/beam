FROM node

WORKDIR /app

COPY package* .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
