FROM node:12.16.1-alpine3.11
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
RUN npm install @vue/cli@3.7.0 -g
CMD ["npm", "run", "serve"]