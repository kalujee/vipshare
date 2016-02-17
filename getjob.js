
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
    // login('kalujee', '123456', function (cookie) {
    //     // console.log('cookie is ', cookie);
    //     getHospitalDetail(cookie)
    // });
}

var scheduled = null;

var start = function() {

    getThunder();
}

module.exports = {
    start: start
};



