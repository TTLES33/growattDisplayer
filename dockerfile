FROM node:20-alpine

# 2. Set the timezone environment variable
RUN apk add --no-cache tzdata
ENV TZ=Europe/Prague


RUN apk add --no-cache su-exec
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

COPY data/config.json /tmp/config.json.initial
COPY data/tempDB.db /tmp/tempDB.db.initial

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .

VOLUME /home/node/app/data
EXPOSE 8081

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD [ "node", "index.js" ]