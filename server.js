/**
 * Created by John on 2016/11/10.
 */
'use strict';

var express = require('express');
var app = express();
var kafka = require('./toKafka.js');
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/toKafka', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    kafka.produce(req.body.key,req.body.message, function (result) {
        res.send(result)
    });
});

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});

