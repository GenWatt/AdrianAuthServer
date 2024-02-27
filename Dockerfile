FROM node:alpine AS Development

RUN npm install -g nodemon

WORKDIR /app
COPY package.json ./

RUN npm i

COPY ./ ./

EXPOSE 3333

CMD ["npm", "run", "dev"]