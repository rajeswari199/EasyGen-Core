FROM node:14-alpine as dev-build

ENV NODE_ENV development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . . 

RUN npm run build

FROM node:14-alpine  as prod-build

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

COPY --from=dev-build /usr/src/app/dist /usr/src/app/dist

CMD ["node", "/usr/src/app/dist/src/main"]

EXPOSE 10080