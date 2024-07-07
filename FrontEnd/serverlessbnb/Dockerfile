FROM node:16.13.2

WORKDIR /a1-container

COPY package.json /a1-container

RUN npm install --legacy-peer-deps

COPY . /a1-container


# default command that runs when it loads up ex node src/server.js
CMD [ "npm", "start"]