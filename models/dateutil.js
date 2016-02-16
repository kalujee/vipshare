var moment = require('moment');
var config = require('config');
moment.defaultFormat = 'YYYY-MM-DD HH:mm:ss Z';
chines_pattern = 'YYYY年MM月DD日 HH点mm分';
chines_pattern_simple = 'MM月DD日HH点'
var dc = function(v){
    if(!v)return null;
    return moment(v).format("YYYY-MM-DD HH:mm:ss");
}

dc.convertTimeField = function(v,paths){
    if(!paths)paths=['createTime','modifyTime'];
    if(Array.isArray(v)){
	v.forEach(function(item){
	    paths.forEach(function(path){
	    	if(item[path])item[path] = moment(item[path]).format();
	    });
	});
    }
    else{
	paths.forEach(function(path){
            if(v[path])v[path] = moment(v[path]).format();
        });	
    }
}

dc.convertTimeField2Chinese = function(v,paths){
    if(!paths)paths=['createTime','modifyTime'];
    if(Array.isArray(v)){
		v.forEach(function(item){
			paths.forEach(function(path){
				if(item[path])item[path] = moment(item[path]).format(chines_pattern);
			});
		});
    }
    else{
		paths.forEach(function(path){
            if(v[path])v[path] = moment(v[path]).format(chines_pattern);
        });	
    }
}

dc.convertTimeField2ChineseSimple = function(v,paths){
    if(!paths)paths=['createTime','modifyTime'];
    if(Array.isArray(v)){
		v.forEach(function(item){
			paths.forEach(function(path){
				if(item[path])item[path] = moment(item[path]).format(chines_pattern_simple);
			});
		});
    }
    else{
		paths.forEach(function(path){
            if(v[path])v[path] = moment(v[path]).format(chines_pattern_simple);
        });	
    }
}


dc.convertTimeAndIdField = function(v,paths){
    if(!paths)paths=['createTime','modifyTime'];
    if(Array.isArray(v)){
        v.forEach(function(item){
            paths.forEach(function(path){
                if(item[path])item[path] = moment(item[path]).format();
            });
	    if(item._id){item.id=item._id;delete item._id}
        });
    }
    else{
        paths.forEach(function(path){
            if(v[path])v[path] = moment(v[path]).format();
        });
	if(v._id){v.id=v._id;delete v._id}
    }
}

dc.lastDayOfHour = function(hour){
	var now = moment();
	var dayOfyear=now.dayOfYear();
	if(dayOfyear==1){
		var lastyear = now.year()-1;
		now.year(lastyear);
		if(lastyear%4!=0)now.dayOfYear(365);
		else now.dayOfYear(366);
	}
	else{
		now.dayOfYear(dayOfyear-1);
	}
	now.hour(hour);
	now.minute(0);
	now.second(0);
	return now;
}

dc.lastDayOfHour4Day = function(day,hour){
	var now = day;
	var dayOfyear=now.dayOfYear();
	if(dayOfyear==1){
		var lastyear = now.year()-1;
		now.year(lastyear);
		if(lastyear%4!=0)now.dayOfYear(365);
		else now.dayOfYear(366);
	}
	else{
		now.dayOfYear(dayOfyear-1);
	}
	now.hour(hour);
	now.minute(0);
	now.second(0);
	return now;
}

dc.todayOfHour = function(hour){
	var now = moment();
	now.hour(hour);
	now.minute(0);
	now.second(0);
	return now;
}

dc.lastNDayOfHour = function(n,hour){
	var now = moment();
	var dayOfyear=now.dayOfYear();
	if(dayOfyear<n){
		var lastyear = now.year()-1;
		now.year(lastyear);
		if(lastyear%4!=0)now.dayOfYear(365-n+dayOfyear);
		else now.dayOfYear(366-n+dayOfyear);
	}
	else{
		now.dayOfYear(dayOfyear-n);
	}
	now.hour(hour);
	now.minute(0);
	now.second(0);
	return now;
}

dc.orderTimeRange4ay = function(day){
	var m = moment(day,'YYYY-MM-DD');
	m.hour(config.orderStartHour);
	return [m,m.clone().hour(config.orderEndHour)];
}

dc.orderTimeRangeOfLastDay = function(){
	var now = moment();
	var dayOfyear=now.dayOfYear();
	if(dayOfyear==1){
		var lastyear = now.year()-1;
		now.year(lastyear);
		if(lastyear%4!=0)now.dayOfYear(365);
		else now.dayOfYear(366);
	}
	else{
		now.dayOfYear(dayOfyear-1);
	}
	now.hour(config.orderStartHour);
	return [now,now.clone().hour(config.orderEndHour)];
}

dc.orderTimeRangeOfToday = function(){
	var now = moment();
	now.hour(config.orderStartHour);
	return [now,now.clone().hour(config.orderEndHour)];
}


dc.today2s = function(){
	return moment().format('YYYY-MM-DD');
}

dc.today2n = function(){
	return parseInt(moment().format('YYYYMMDD'));
}

dc.lastNDay2n = function(n){
	var now = moment();
	var dayOfyear=now.dayOfYear();
	if(dayOfyear<n){
		var lastyear = now.year()-1;
		now.year(lastyear);
		if(lastyear%4!=0)now.dayOfYear(365-n+dayOfyear);
		else now.dayOfYear(366-n+dayOfyear);
	}
	else{
		now.dayOfYear(dayOfyear-n);
	}
	return parseInt(now.format('YYYYMMDD'));
}



//获得本周的开端日期 
dc.getWeekStartDate = function() { 

	var nowDayOfWeek = now.getDay(); //今天本周的第几天 
	var nowDay = now.getDate(); //当前日 
	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0;

	var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); 
	
	return moment(weekStartDate).format();
} 

//获得本周的停止日期 
dc.getWeekEndDate = function() { 
	var nowDayOfWeek = now.getDay(); //今天本周的第几天 
	var nowDay = now.getDate(); //当前日 
	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0;
	var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)); 
	return moment(weekEndDate).format();
} 

//获得本月的开端日期 
dc.getMonthStartDate = function() {

	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; 
	var monthStartDate = new Date(nowYear, nowMonth, 1); 
	return moment(monthStartDate).format(); 
} 


//获得某月的天数 
dc.getMonthDays = function(myMonth) { 
	var monthStartDate = new Date(nowYear, myMonth, 1); 
	var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
	var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
	return days; 
} 

//获得本季度的开端月份 
function getQuarterStartMonth(){ 
	var nowMonth = now.getMonth(); //当前月 
	var quarterStartMonth = 0; 
	if(nowMonth<3){ 
	quarterStartMonth = 0; 
	} 
	if(2<nowMonth && nowMonth<6){ 
	quarterStartMonth = 3; 
	} 
	if(5<nowMonth && nowMonth<9){ 
	quarterStartMonth = 6; 
	} 
	if(nowMonth>8){ 
	quarterStartMonth = 9; 
	} 
	return quarterStartMonth; 
} 

//获得本月的停止日期 
dc.getMonthEndDate = function() {
	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; 
	var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth)); 
	return moment(monthEndDate).format(); 
} 

//获得本季度的开端日期 
dc.getQuarterStartDate = function(){ 

	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; 
	var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1); 
	return moment(quarterStartDate).format(); 
} 

//或的本季度的停止日期 
dc.getQuarterEndDate = function() { 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; 
	var quarterEndMonth = getQuarterStartMonth() + 2; 
	var quarterEndDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth)); 

	return moment(quarterEndDate).format(); 
} 

//var data = [{nam: 'henry', createTime: new Date(), modifyTime: new Date()}];
//dc.convertTimeField(data);
//console.log(data);
module.exports= dc;
