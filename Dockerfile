FROM node:12.21.0-alpine

RUN apk update && apk add --no-cache curl && apk add yarn

# Create Directory for the Container
WORKDIR /usr/src/app

COPY package.json .

# Install all Packages
RUN yarn install --ignore-engines

# Copy all other source code to work directory
ADD . /usr/src/app

# Start
CMD [ "yarn", "start" ]
EXPOSE 9991

