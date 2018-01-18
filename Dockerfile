
FROM hub.c.163.com/library/node:latest

WORKDIR /app

COPY . /app

RUN npm install pm2 -g

EXPOSE 8081

# 该项目有两个服务，所以用这种方式启动
# docker run --name ks -d -p 8081:8081 kser:pm2 pm2-runtime dest/server.js
# docker run --name ks2 -d kser:pm2 pm2-runtime dest/consumer.js
# CMD ["pm2-runtime", "dest/server.js", "--no-daemon"]
# ENTRYPOINT ["node", "server.js"]
