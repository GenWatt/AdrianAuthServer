FROM node:alpine AS Development

ARG PORT=3333

ENV PORT=$PORT
ENV MONGODB_URI='mongodb+srv://ToDoList:1234@todolist.q8jv5.mongodb.net/AdrianAuth?retryWrites=true&w=majority'
ENV JWT_SECRET_KEY='secrethaha'
ENV JWT_REFRESH_KEY='asdaad'
ENV JWT_CONFIRM_KEY='asdasdsd'
ENV JWT_RESET_KEY='asdasdsdsdds'
ENV EMAIL='adrian.kosoglos@gmail.com'
ENV EMAIL_PASSWORD='yyvyykhjroudbxky'
ENV BASE_URL='http://localhost:3333'
ENV AUTH_CLIENT_URL='http://127.0.0.1:5173'
ENV ADRIAN_TUBE_URL='https://localhost:7109'

EXPOSE ${PORT}
WORKDIR /adrianauth
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm i

CMD ["npm", "run", "dev"]