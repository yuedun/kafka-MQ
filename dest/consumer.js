"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kafka_node_1 = require("kafka-node");
var HttpRequest = require("request");
var Promise = require("bluebird");
var config_1 = require("./config");
var client = new kafka_node_1.Client(config_1.kafkaMQ.zookeeper), consumer = new kafka_node_1.Consumer(client, [
    {
        topic: 'arrange-lesson',
        partition: 0
    }
], {
    autoCommit: true //设置为true会自动维护offset，服务停启会从上次消费的位置开始获取，设置为false需要手动维护
});
console.log('消费者正在监听……');
consumer.on('message', function (message) {
    var msgObj = JSON.parse(message.value);
    //elasticsearch记录消费信息
    myRequest(config_1.JavaServiceApi.elastisseacher + '/arrange_lesson/first/', message, false);
    //排课推送学生APP
    var stubody = {
        contentMap: {
            teacher: msgObj.first_name, date: msgObj.startTime
        },
        mobiles: [msgObj.mobile],
        jumpRemark: msgObj.teacherId,
        source: "MANAGEMENT",
        tpltId: 12
    };
    myRequest(config_1.JavaServiceApi.studentMsg + '/services/studentsPushFacade/notification', stubody);
});
/**
 *
 * @param url 请求地址
 * @param message 请求参数
 * @param log 是否需要记录成功或错误日志
 */
function myRequest(url, message, log) {
    if (log === void 0) { log = true; }
    return new Promise(function (resolve, reject) {
        HttpRequest.post({
            url: url,
            body: message,
            json: true
        }, function (err, res, body) {
            if (err) {
                reject(err);
            }
            resolve(body);
        });
    }).then(function (data) {
        if (log) {
            return myRequest(config_1.JavaServiceApi.elastisseacher + '/request_log/success/', {
                url: url,
                message: message
            });
        }
    }).catch(function (err) {
        if (log) {
            myRequest(config_1.JavaServiceApi.elastisseacher + '/request_log/error/', {
                url: url,
                message: message
            });
        }
    });
}
