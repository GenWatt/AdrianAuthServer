FROM node:alpine AS Development

ARG PORT=3333

EXPOSE ${PORT}
WORKDIR /adrianauth
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i

CMD ["npm", "run", "dev"]