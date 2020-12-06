FROM node:14

# USER node

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci

# Bundle app source
COPY . .

EXPOSE 80

CMD [ "bash", "./start.sh" ]