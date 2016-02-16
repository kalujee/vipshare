
var jsdom = require("jsdom");
var async = require("async");
var http = require("http");
var iconv = require('iconv-lite');
// var JobModel = require('./models').job;
// var HospitalModel = require('./models').hospital;
// var PreferenceModel = require('./models').preference;
// var config = require('config');
// var apn = require('apn');
// var schedule = require('node-schedule');
// var utils = require('./utils');
var moment = require('moment');
var cheerio = require('cheerio');
var request = require('request');

var thunderStartindex = process.env.Thunder;
var iQiqiStartindex = process.env.IQiqi;


var Bmob = require("bmob").Bmob;
//初始化，第一个参数是Application_id，第二个参数是REST API Key
Bmob.initialize("71013e2a98aef3eb77632ddadd073d56", "dd4ecc8f3c980c6c3de32c2dc5a1a46b");

//添加一行数据
var ThunderStore = Bmob.Object.extend("thunder");
var IQiyiStore = Bmob.Object.extend("iqiyi");

String.prototype.Trim = function()    
{    
    return this.replace(/(^\s*)|(\s*$)/g, "");    
}    

var insertJob = function(name, url, hospital, date, cb) {

    JobModel.isExist(name, hospital, function(err, exist) {
        if (exist == false) {
            JobModel.insertNew({name: name, 
                                url: url, 
                                hospital: hospital, 
                                releaseData: moment(date, "YYYY-MM-DD").toDate()},
                                function(err, job) {
                                    if (err) {
                                        cb(err);
                                    } else if (!job) {
                                        cb('fail to create job');
                                    } else {

                                        //判断是否是需要推送给其它的
                                        //同时需要避免推送风暴
                                        //增加一个待推送的列表
                                        //如果已经在列表中，就不推送了
                                        //
                                        checkShouldPush(name);
                                        cb(null);
                                    }
                                }
                                );
        } else if(err && exist == null) {
            // checkShouldPush(name);
            cb(err);
        } else {
            // update
            // checkShouldPush(name);
            JobModel.update({name: name, hospital: hospital}, 
                            {$set: {releaseData: moment(date, "YYYY-MM-DD").toDate()}}, function(err, newone) {
                                cb(err);
                            });
        }
    });
}

var getThunder = function() {

    console.log('page is----', thunderStartindex);

    var option = {
        hostname: "www.xunleihuiyuan.net",
        path: "/vip/" + thunderStartindex  + ".html"
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
            
            // console.log(data_string);

            $ = cheerio.load(data_string);

            $("div.post-body.formattext").children().each(function(i, element) {
                // console.log($(this).text());
                var text = $(this).text().Trim();

                var user_start = text.indexOf('账号');
                var pwd_start1 = text.indexOf('密码');
                var pwd_start2 = text.indexOf('密');
                // console.log(text, user_start, pwd_start1, pwd_start2);

                if (user_start > 0 && (pwd_start1 > 0 || pwd_start2 > 0)) {
                    var username = text.substring(user_start + 2, pwd_start1 < 0 ? pwd_start2 : pwd_start1);
                    var pwd = '';
                    if (pwd_start1 > 0) {
                        pwd = text.substring(pwd_start2 + 2, text.length);
                    } else if (pwd_start2 > 0) {
                        pwd = text.substring(pwd_start2 + 1, text.length);
                    }

                    var store = new ThunderStore();
                    store.set("username", username);
                    store.set("password", pwd);

                    store.save(null, {
                        success: function(object) {
                            console.log("create object success, object id:" + object.id);
                        },
                        error: function(model, error) {
                            console.log("create object fail", error);
                        }
                    });
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
    // login('kalujee', '123456', function (cookie) {
    //     // console.log('cookie is ', cookie);
    //     getHospitalDetail(cookie)
    // });
}

var scheduled = null;

var start = function() {

    getThunder();
}

start();



