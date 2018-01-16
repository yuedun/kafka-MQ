/**
 * Created by John on 2016/11/10.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var app = express();
var producer_1 = require("./producer");
var kafka = new producer_1.default();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get('/', function (req, res) {
    res.send("ok");
});
app.post('/send', function (req, res) {
    // 输出 JSON 格式
    kafka.produce(req.body.key, req.body.message, function (err, result) {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
