FROM ubuntu:14.04.3
# install nodejs and npm
RUN apt-get update
RUN apt-get install -y nodejs npm
# Bundle app source
COPY . /src
WORKDIR /src
# Install app dependencies
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install
CMD ["node", "/src/index.js"]