 chrome.runtime.onInstalled.addListener(function() {

 	chrome.alarms.create('notificationId', { delayInMinutes: 1, periodInMinutes: 1});

 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
 		chrome.declarativeContent.onPageChanged.addRules([{
 			conditions: [new chrome.declarativeContent.PageStateMatcher({ pageUrl: {}, })], actions: [new chrome.declarativeContent.ShowPageAction()]
 		}]);
 	});

 });

 chrome.alarms.onAlarm.addListener(function( alarm ) {

  var x = new XMLHttpRequest();

  x.open('GET', 'http://hpb.health.gov.lk/api/get-current-statistical');
  x.onload = function() {   
  	var statisticalData = JSON.parse(x.responseText);

  	chrome.storage.sync.get('updatetime', function(data) {
  		var time = data == null ? null : data.updatetime;

  		console.log("Last updated on : "+time+", HPB Last updated time : "+statisticalData.data.update_date_time);

  		if(time != statisticalData.data.update_date_time){

  			chrome.storage.sync.set({updatetime: statisticalData.data.update_date_time}, function() { 
  				console.log("Last updates time Set : " + statisticalData.data.update_date_time);
  			});

  			chrome.notifications.create('', {
  				title: 'Sri Lanka COVID-19 Updates',
  				message: statisticalData.data.local_new_cases + ' new cases found during the last 24 hours. '+ statisticalData.data.local_total_cases  +' total confirmed cases reported.',
  				iconUrl: 'images/logo128.png',
  				type: 'basic'
  			});
  		}

  	});
  };

  x.send();
});