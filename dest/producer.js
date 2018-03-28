"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kafka_node_1 = require("kafka-node");
var config_1 = require("./config");
// var client = new kafka.Client('10.168.58.205:2181');//连接zookeeper
var client = new kafka_node_1.KafkaClient({ kafkaHost: config_1.kafkaMQ.kafka }); //多个地址用逗号分割
var toKafka = /** @class */ (function () {
    function toKafka() {
        this.producer = new kafka_node_1.Producer(client);
        this.producer.on('ready', function () {
            console.log("kafka连接成功！");
        });
        this.producer.on('error', function (err) {
            console.log("kafka连接失败！", err);
        });
    }
    toKafka.prototype.produce = function (key, message, callback) {
        /**
         * 不使用key时producer产生的消息只发送到一个partition，导致只有一个consumer线程可以获取数据。
         * 原因在于producer没有使用key将消息hash（不设置key，将导致消息只发送给一个partition），
         * 使用key message会根据它进行hash，然后分布到不同partition
         */
        var msg = "";
        try {
            msg = JSON.stringify(message);
        }
        catch (error) {
            callback(error);
        }
        var payloads = [
            { topic: 'arrange-lesson', messages: new kafka_node_1.KeyedMessage(key, msg) }
        ];
        this.producer.send(payloads, function (err, data) {
            if (!!err) {
                console.log("err:", err);
                callback(err);
            }
            console.log("data:", data);
            callback(null, data);
        });
    };
    return toKafka;
}());
exports.default = toKafka;
