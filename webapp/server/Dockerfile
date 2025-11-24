FROM node:18

WORKDIR /app

COPY package*.json ./

# Install dependencies + nodemon globally
RUN npm install && npm install -g nodemon

COPY . .

EXPOSE 8000

CMD ["npm", "start"]