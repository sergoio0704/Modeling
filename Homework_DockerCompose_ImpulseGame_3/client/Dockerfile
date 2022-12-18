FROM node:14.17.1
WORKDIR /opt/client
COPY package*.json .
RUN npm install 
COPY . .
CMD ["npm", "start"]