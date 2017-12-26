var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.Client('localhost:2181'),
    consumer = new Consumer(
        client,
        [
            { topic: 'test', partition: 0 }
        ],
        {
            autoCommit: false
        }
    );
    console.log('消费者监听')
consumer.on('message', function (message) {
    console.log(message);
});