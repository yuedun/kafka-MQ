import { Consumer, Client, Message } from 'kafka-node';
import * as HttpRequest from 'request';
import * as Promise from 'bluebird';
import { kafkaMQ, JavaServiceApi } from './config';
import { resolve, reject } from 'bluebird';

export function runConsumer() {
    const client = new Client(kafkaMQ.zookeeper),
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
    console.log('消费者正在监听……');

    interface ArrangeLesson {
        lessonId: number;
        teacherUserId: number;
        lesStartTime: string;
        testLessonKnowledgeId: number;
        grade: string;
        subject: string;
        studentName: string;
        first_name: string;//老师姓名
        startTime: string;//课程开始时间
        mobile: string;
        teacherId: number;
    }
    consumer.on('message', function (message: Message) {
        let msgObj: ArrangeLesson = JSON.parse(message.value);
        console.log(msgObj);
        
        //elasticsearch记录消费信息
        myRequest(JavaServiceApi.elastisseacher + '/arrange_lesson/first/', message, false);

        (function(){
            //排课推送学生APP
            var stubody: {
                contentMap: { teacher: string; date: string };
                mobiles: string[];
                jumpRemark: number;
                source: string;
                tpltId: number;
            } = {
                    contentMap: {
                        teacher: msgObj.first_name, date: msgObj.startTime
                    },
                    mobiles: [msgObj.mobile],
                    jumpRemark: msgObj.teacherId,
                    source: "MANAGEMENT",
                    tpltId: 12
                }
            myRequest(JavaServiceApi.studentMsg + '/services/studentsPushFacade/notification', stubody);
        })()
    });

    /**
     * 
     * @param url 请求地址
     * @param message 请求参数
     * @param log 是否需要记录请求成功或失败的日志
     */
    function myRequest(url: string, message: any, log = true): Promise<any> {
        return new Promise((resolve, reject) => {
            HttpRequest.post({
                url,
                body: message,
                json: true
            }, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                resolve(body)
            })
        }).then(data => {
            if (log) {
                myRequest(JavaServiceApi.elastisseacher + '/request_log/success/', {
                    url,
                    message,
                    created_at: new Date()
                }, false);
            }
        }).catch(err => {
            if (log) {
                myRequest(JavaServiceApi.elastisseacher + '/request_log/error/', {
                    url,
                    message,
                    created_at: new Date()
                }, false);
            }
        })
    }
}

runConsumer()