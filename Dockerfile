FROM mhart/alpine-node:10

# Create app directory
WORKDIR /workspace

# Ensure both package.json AND yarn.lock are copied
COPY package.json ./
COPY yarn.lock ./

# Install app dependencies
RUN yarn

# Bundle app source
COPY . /workspace

EXPOSE 3000

VOLUME ["/workspace", "/workspace/responses"]

CMD ["yarn","dev"]
