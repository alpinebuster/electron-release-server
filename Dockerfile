FROM node:19

# Create app directory
WORKDIR /usr/src/electron-release-server

# Install app dependencies
COPY package.json .bowerrc bower.json /usr/src/electron-release-server/
RUN --mount=type=cache,target=/root/.npm \
  npm config set registry https://registry.npm.taobao.org/ \
  && npm install \
  && ./node_modules/.bin/bower install --allow-root \
  && npm cache clean --force \
  && npm prune --production

# Bundle app source
COPY . /usr/src/electron-release-server
COPY config/docker.js config/local.js

EXPOSE 80

CMD [ "npm", "start" ]
