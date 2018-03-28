# kafka启动

首先启动kafka自带的zookeeper
>  bin/zookeeper-server-start.sh config/zookeeper.properties

再启动kafka服务
>  bin/kafka-server-start.sh config/server.properties

创建topic
>  bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test

查看topic
> bin/kafka-topics.sh --list --zookeeper localhost:2181

在命令行中启动生产者
> bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test

在命令行启动消费者
> bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning

# 作为消息中心的设计方案
## 第一种：中心消息系统
利用http服务对外提供生产消息的RESTful接口，消费者服务收到消息后统一调用第三方各种服务。
+ 优点：是不需要第三方服务增加kafka相关设计和代码，只需按照旧的方式提供接口即可。
+ 缺点：有新的接口需要调用时需要修改消息中心代码进行重新发布

![消息中心](http://hopefully.qiniudn.com/center-mq.png)

## 第二种：各个业务系统分别实现生产者和消费者功能
原本提供接口的第三方系统需要实现消费者功能来监听是否有消息产生，代替http接口方式，消息生产者也需要相应的开发来生产消息。
+ 优点：不需要单独的消息中心转发消息，第三方服务只需提供简单的http接口即可
+ 缺点： 需要更多的协调开发

![消息中心](http://hopefully.qiniudn.com/kafka-center.png)

# docker镜像创建和运行

切换到项目根目录，执行以下命令：

> docker build -t kserver:1 .

`-t`给镜像加名字和标签，`.`当前路径

> docker run --name ks -ti -p 8081:8081 kserver:1
`--name`起一个别名，`-ti`交互方式运行，`-p`绑定宿主机端口到容器端口

## 提交镜像到docker hub
docker hub创建repository：`yuedun/yddocker`

> docker tag kserver:1 yuedun/yddocker:1
> docker push yuedun/yddocker:1

docker run --name ks -ti -p 8081:8081 yuedun/yddocker:2 node dest/server.js
docker run --name ks2 -ti yuedun/yddocker:2 node dest/consumer.js
或

docker run --name ks -d -p 8081:8081 kser:pm2 pm2-runtime dest/server.js
docker exec -ti ks /bin/sh
和
docker run --name ks2 -d kser:pm2 pm2-runtime dest/consumer.js
docker exec -ti ks2 /bin/sh

进入后台运行的docker内
docker exec -ti ks /bin/sh

# 关于生产者和消费者参数的参数问题
生产者向消费者发布消息的时候一般采用最少参数原则。例如生产者修改了user表多个字段，只需要传user_id即可，因为消费者端可能会有不同的操作，生产者无法确定。
如果多个消费者做相同的操作，可以约定生产者发送统一参数。一般建议消费者自己查询需要的参数。