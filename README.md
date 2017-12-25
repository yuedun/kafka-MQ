# kafka启动

首先启动kafka自带的zookeeper
> hale@ubuntu:~/software/kafka_2.11-1.0.0$ bin/zookeeper-server-start.sh config/zookeeper.properties

再启动kafka服务
> hale@ubuntu:~/software/kafka_2.11-1.0.0$ bin/kafka-server-start.sh config/server.properties

创建topic
> hale@ubuntu:~/software/kafka_2.11-1.0.0$ bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test

查看topic
> bin/kafka-topics.sh --list --zookeeper localhost:2181

在命令行中启动生产者
> bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test

在命令行启动消费者
> bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test --from-beginning