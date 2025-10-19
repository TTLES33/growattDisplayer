FROM node:18-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
COPY data/config.json /home/node/app/data/config.json
COPY data/tempDB.db /home/node/app/data/tempDB.db
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY --chown=node:node . .
EXPOSE 8081
CMD [ "node", "index.js" ]