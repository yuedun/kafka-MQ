var kafka = require('kafka-node');
var KeyedMessage = kafka.KeyedMessage;
var Producer = kafka.Producer;
// var client = new kafka.Client('localhost:2181');//连接zookeeper
const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});//多个地址用逗号分割
var producer = new Producer(client);
console.log('连接kafka中');

class toKafka {

    static produce(key, message, cb) {
        let payloads = [
            { topic: 'test', messages: new KeyedMessage(key, message) }
        ];

        producer.on('ready', function () {
            console.log(3)
        });

        producer.send(payloads, function (err, data) {
            if (!!err){
                console.log("err:",err)
            }
            console.log("data:",data);
            cb(data);
        });
    }
}

module.exports = toKafka;