# Start with a modern Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate the Prisma client
RUN npx prisma generate

# Copy the rest of your backend code
COPY . .

# --- This is a new required step ---
# We need to build the TypeScript code into JavaScript
# This assumes you have typescript installed as a devDependency
RUN npm run build

# Expose the port your server runs on
EXPOSE 3000

# The command to start your (now built) JavaScript server
CMD [ "node", "dist/server.js" ]