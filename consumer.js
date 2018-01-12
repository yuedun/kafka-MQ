const kafka = require('kafka-node');
const HttpRequest = require('request');
const config = require('./config.js');

const Consumer = kafka.Consumer,
    client = new kafka.Client(config.zookeeper),
    consumer = new Consumer(
        client,
        [
            {
                topic: 'arrange-lesson',
                partition: 0
            }
        ],
        {
            autoCommit: true//设置为true会自动维护offset，服务停启会从上次消费的位置开始获取，设置为false需要手动维护
        }
    );
console.log('消费者正在监听……')
consumer.on('message', function (message) {
    let msgObj = JSON.parse(message.value);
    console.log("消费者输出：", msgObj.lessonId);
    HttpRequest.post("url", { json: true, body: msgObj }, function (err, resp, body) {

    })
});