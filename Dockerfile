FROM node:alpine

# Install dependencies
RUN apk --no-cache update && apk add --no-cache npm

# Add /app/node_modules/.bin to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Create our app filesystem tree
RUN mkdir -p /app/node_modules/.cache /app/chrome /app/css /app/dist /app/example /app/lib /app/views

WORKDIR /app

# Copy app code into container in /data
COPY --chown=root:root . /app/

RUN rm -f /app/Dockerfile /app/LICENSE /app/README.md

RUN npm install

CMD ["/app/entrypoint.sh"]
