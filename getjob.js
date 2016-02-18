
var jsdom = require("jsdom");
var async = require("async");
var http = require("http");
var iconv = require('iconv-lite');
var schedule = require('node-schedule');
var moment = require('moment');
var cheerio = require('cheerio');
var request = require('request');

var thunderStartindex = process.env.Thunder;
var iQiqiStartindex = process.env.IQiyi;

var thunderIndex = thunderStartindex;
var iQiyiIndex = iQiqiStartindex;
var count_thunder = 0;
var count_iqiyi = 0;

var Bmob = require("bmob").Bmob;
//初始化，第一个参数是Application_id，第二个参数是REST API Key
Bmob.initialize("71013e2a98aef3eb77632ddadd073d56", "dd4ecc8f3c980c6c3de32c2dc5a1a46b");

//添加一行数据
var ThunderStore = Bmob.Object.extend("thunder");
var IQiyiStore = Bmob.Object.extend("iqiyi");
var execcount_Store = Bmob.Object.extend("exec_count");

String.prototype.Trim = function()    
{    
    return this.replace(/(^\s*)|(\s*$)/g, "");    
}

var getThunder = function() {

    console.log('page is----', thunderIndex);

    var option = {
        hostname: "www.xunleihuiyuan.net",
        path: "/vip/" + thunderIndex  + ".html"
    };

    var data_string = "";
    var allexist = false;
    var req = http.request(option, function(res) {

        var values = [];
        res.on("data", function(chunk) {
            var count = 0;
            var string = iconv.decode(chunk, "utf8");
            data_string = data_string + string;
        });
        
        res.on('end', function(data) {

            if (res.statusCode == 404) {
                console.log('404 not found');
                return;
            }

            count_thunder ++;
            thunderIndex = parseInt(thunderStartindex) + count_thunder;
            getThunder();
            // 
            $ = cheerio.load(data_string);

            $("div.post-body.formattext").children().each(function(i, element) {
                var text = $(this).text().Trim();
                var re_u = new RegExp("\\w{1,}\:\\d");
                var result = re_u.exec(text);
                if (result) {
                    var re_p = new RegExp("\\d+");
                    var username = result[0];
                    var sub_str = text.substring(result.index + username.length);
                    var result_p = re_p.exec(sub_str);
                    if (result_p) {
                        var pwd = result_p[0];

                        var store = new ThunderStore();
                        store.set("username", username);
                        store.set("password", pwd);
                        store.set("liked", Math.ceil(Math.random() * 300 + 100));
                        store.set("unliked", Math.ceil(Math.random() * 100 + 10));

                        store.save(null, {
                            success: function(object) {
                                console.log("create object success, object id:" + object.id);
                            },
                            error: function(model, error) {
                                console.log("create object fail", error);
                                if (error.code == 401) {
                                    // 已经存在，就删除更新
                                    var query = new Bmob.Query(ThunderStore);
                                    query.equalTo("username", username); 
                                    // 查询所有数据并删除
                                    query.destroyAll({
                                       success: function(){
                                          //删除成功
                                          store.save();
                                       },
                                       error: function(err){
                                          // 删除失败
                                       }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });
    }).on("error", function(e) {
        console.log('error is', e.message);
        // cb(e);
    });

    req.end();
}

var getIQiyi = function() {
    
    console.log('page is----', iQiyiIndex);

    var option = {
        hostname: "www.yudi8.com",
        path: "/vip/" + iQiyiIndex  + ".html"
    };

    console.log(option);
    var data_string = "";
    var allexist = false;
    var req = http.request(option, function(res) {

        var values = [];
        res.on("data", function(chunk) {
            var count = 0;
            var string = iconv.decode(chunk, "gb2312");
            data_string = data_string + string;
        });
        
        res.on('end', function(data) {

            if (res.statusCode == 404) {
                console.log('404 not found');
                return;
            }

            if (count_iqiyi > 300) {

                return;
            }
            count_iqiyi ++;
            iQiyiIndex = parseInt(iQiqiStartindex) + count_iqiyi;
            getIQiyi();

            $ = cheerio.load(data_string);

            $("section.content").children().each(function(i, element) {
                // var text = $(this).text().Trim();
                if (this.next) {
                    var data = this.next.data;
                    if (data && data.length > 10) {
                        var re_email = /[\w-]{1,}@\w{1,}\.\w{1,}/;
                        var re_phone = /1\d{10}/;
                        var re_qq = /\d{6,}/;
                        var re_pwd = /\w{5,}/;

                        var exec_email = re_email.exec(data);
                        var username = null;
                        var pwd = null;
                        var index = -1;

                        if (exec_email) {
                            
                            username = exec_email[0];
                            index = exec_email.index;
                        } else {
                            var exec_phone = re_phone.exec(data);
                            if (exec_phone) {
                                username = exec_phone[0];
                                index = exec_phone.index;
                            } else {
                                var exec_qq = re_qq.exec(data);
                                if (exec_qq) {
                                    username = exec_qq[0];
                                    index = exec_qq.index;
                                }
                            }
                        }

                        if (username) {
                            var sub_str = data.substring(index + username.length);
                            var result_p = re_pwd.exec(sub_str);
                            if (result_p) {
                                pwd = result_p[0];
                            }
                        }

                        console.log(username, pwd);
                        if (username && pwd) {
                            var store = new IQiyiStore();
                            store.set("username", username);
                            store.set("password", pwd);
                            store.set("liked", Math.ceil(Math.random() * 300 + 100));
                            store.set("unliked", Math.ceil(Math.random() * 20 + 5));

                            store.save(null, {
                                success: function(object) {
                                    console.log("create object success, object id:" + object.id);
                                },
                                error: function(model, error) {
                                    console.log("create object fail", error);
                                    if (error.code == 401) {
                                        // 已经存在，就删除更新
                                        var query = new Bmob.Query(IQiyiStore);
                                        query.equalTo("username", username); 
                                        // 查询所有数据并删除
                                        query.destroyAll({
                                           success: function(){
                                              //删除成功
                                              store.save();
                                           },
                                           error: function(err){
                                              // 删除失败
                                           }
                                        });
                                    }
                                }
                            });
                        }

                    }
                }
                
            });
        });

        // res.on('error', function(err) {
        //     console.log(err);
        // });
    }).on("error", function(e) {

        console.log('error is', e.message);
        
    });

    req.end();
}

//
// 统计执行crontab的次数、
// 
var addExecCount = function(name) {
    var query = new Bmob.Query(execcount_Store);
    query.equalTo("name", name);
    query.find({
       success: function(results){
            if (results.length > 0) {
                var obj = results[0];
                var count = obj.get('count');
                obj.set('count', parseInt(count) + 1);
                obj.save();
            }
       },
       error: function(err){
          
       }
    });
}

var startIqiyi = function() {
    console.log('start iqiyi');
    count_iqiyi = 0;
    getIQiyi();

    addExecCount("iqiyi");
    
}

var startThunder = function() {
    console.log('start thunder');
    count_thunder = 0;
    getThunder();
    addExecCount('thunder');
}

var crontab = require('node-crontab');

var start = function() {
    console.log('scheduled');

    var scheduled = crontab.scheduleJob('5 * * * *', startIqiyi);
    var scheduled2 = crontab.scheduleJob('5 0,8,14,22 * * *', startThunder);

}

module.exports = {
    start: start
};



