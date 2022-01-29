FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /myretro-ui

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

RUN npm install -g npm@7.24.0
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

RUN npm run dev

EXPOSE 9528
CMD [ "http-server", "dist" ]