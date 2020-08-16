FROM node:12

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

EXPOSE 3000
EXPOSE 3001

CMD [ "npm", "start" ]