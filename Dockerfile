
FROM hub.c.163.com/library/node:latest

WORKDIR /app

COPY . /app

EXPOSE 8081

# CMD ["/bin/bash", "-c","npm start"]
# ENTRYPOINT ["node", "dest/server.js"]
