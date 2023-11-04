FROM node:16.15.0
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "start"]