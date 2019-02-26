FROM mhart/alpine-node:10

# Create app directory
WORKDIR /app

# Ensure both package.json AND yarn.lock are copied
COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn

# Bundle app source
COPY . /app

EXPOSE 3000

CMD ["yarn", "start"]
