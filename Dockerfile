FROM node:carbon
# App directory
WORKDIR /usr/src/app
# Install dependencies
# Copy package.json or package-lock.json
COPY package*.json ./
RUN npm install
# If building for production
# RUN npm install --only=production

# Bundle source
COPY . .
# Expose port 3000
EXPOSE 3000

# Start the server
CMD [ "npm", "start" ]