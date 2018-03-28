/**
 * Created by John on 2016/11/10.
 */
'use strict';

var express = require('express');
var app = express();
import Kafka from './producer';
var kafka = new Kafka();
import * as consumer from './consumer';
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

console.log(app.get('env'))

app.get('/', function (req: any, res: any) {
    res.send("ok")
})

/**
 * 测试在docker中的pm2是否有用
 */
app.get('/err', function (req: any, res: any) {
    if (req.query.a==1) {
        throw new Error("发生错误")
    }
    res.send("ok")
})

app.post('/send', function (req: any, res: any) {
    // 输出 JSON 格式
    kafka.produce(req.body.key, req.body.message, function (err: any, result: any) {
        if (err) {
            res.send(err)
        }
        res.send(result)
    });
});

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});

