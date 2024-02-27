# Adrian Auth Server

### This is server for [AdrianAuthClient](https://github.com/GenWatt/AdrianAuthClient) for more info go to AdrianAuthClient

## To run this:
* Clone repo
* Make .env file and fill it. In [.env.sample](./.env.sample) you can check what fields are needed
* Run `npm i` to install libs
* Run `npm run dev` to start the app

## This app using:
* nodejs with express
* mongoose for mongodb connection
* JWT token for authentication and generate links for forget password feature
* nodemailer for sending mails
* In [EmailSender](./src/utils/emailSender.ts) you can change service by default is `gmail`
* Docker