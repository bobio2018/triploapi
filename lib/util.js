'use strict';

var getTimestamp = function(){
	return Math.round((new Date()).getTime());
}

var getElapsedTimeInSeconds = function(t1,t2){
	return Math.round(((t2-t1)/1000) * 100) / 100;
}


module.exports = {
    getTimestamp: getTimestamp,
    getElapsedTimeInSeconds: getElapsedTimeInSeconds,
};