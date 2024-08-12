FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
COPY tsconfig.json ./
COPY src ./src
COPY tools ./tools
COPY types ./types
RUN npm i -g npm@latest
RUN npm ci && npm run build
RUN  npm run build


FROM node:21-alpine3.18

WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY .npmrc ./
COPY tsconfig.json ./
RUN npm i -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4001

CMD [ "npm", "run", "start" ]

# CMD ["sh", "-c", "tail -f /dev/null"]
