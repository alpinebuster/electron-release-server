FROM node:19

# Create app directory
WORKDIR /usr/src/as-release-server

# Install app dependencies
COPY package.json .bowerrc bower.json /usr/src/as-release-server/
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g bower pm2

RUN --mount=type=cache,target=/root/.npm \
  npm install \
  && ./node_modules/.bin/bower install --allow-root \
  && npm cache clean --force \
  && npm prune --production

# Bundle app source
COPY . /usr/src/as-release-server
COPY config/docker.js config/local.js

EXPOSE 80

# CMD [ "npm", "start" ]
CMD ["pm2-runtime", "ecosystem.config.js"]
