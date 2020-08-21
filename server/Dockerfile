FROM node:12

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]