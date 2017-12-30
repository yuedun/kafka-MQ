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