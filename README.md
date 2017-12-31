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