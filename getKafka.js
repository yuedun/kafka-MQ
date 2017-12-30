var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client('localhost:2181'),
    consumer = new Consumer(
        client,
        [
            {
                topic: 'test',
                partition: 0
            }
        ],
        {
            autoCommit: true//设置为true会自动维护offset，服务停启会从上次消费的位置开始获取，设置为false需要手动维护
        }
    );
console.log('消费者监听')
consumer.on('message', function (message) {
    console.log("消费者输出：", message);
});