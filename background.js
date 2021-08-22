 chrome.runtime.onInstalled.addListener(function() {

 	chrome.alarms.create('notificationId', { delayInMinutes: 1, periodInMinutes: 1});

 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
 		chrome.declarativeContent.onPageChanged.addRules([{
 			conditions: [new chrome.declarativeContent.PageStateMatcher({ pageUrl: {}, })], actions: [new chrome.declarativeContent.ShowPageAction()]
 		}]);
 	});

 });
 

 chrome.alarms.onAlarm.addListener(function( alarm ) {

  const news_sources = ["www.newsfirst.lk", "www.adaderana.lk", "www.newswire.lk", "www.dailymirror.lk", "www.colombopage.com", "www.dailynews.lk"];
  
  for (let i = 0; i < news_sources.length; i++) {

	setTimeout(function () {
		const RSS_URL = 'https://news.google.com/rss/search?q=Covid 19 site:' + news_sources[i] + '&hl=en-US&gl=US&ceid=US:en';	

		var x = new XMLHttpRequest();
		x.open('GET', RSS_URL);
		x.onload = function() {
			
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(x.responseText,"text/xml");
	  
			chrome.storage.sync.get('updatetime', function(data) {
				
				var time = (data === null || (typeof data.updatetime === 'undefined')) ? 0 : data.updatetime;
				var new_time = Date.parse(xmlDoc.getElementsByTagNameNS('*','pubDate')[0].childNodes[0].nodeValue);
	  
				console.log(news_sources[i])
				console.log("Last updated on : "+time.toString()+", Source Last updated time : "+new_time);
	  
				if(time < new_time){
					
					chrome.storage.sync.set({updatetime: new_time}, function() { 
						console.log("Last updates time Set : " + new_time);
					});

					chrome.storage.sync.set({latest_news: xmlDoc.getElementsByTagNameNS('*','title')[1].childNodes[0].nodeValue, latest_news_link : xmlDoc.getElementsByTagNameNS('*','link')[1].childNodes[0].nodeValue}, function() { 
						console.log("Latest news Set : " + xmlDoc.getElementsByTagNameNS('*','title')[1].childNodes[0].nodeValue);
						console.log("Latest news link Set : " + xmlDoc.getElementsByTagNameNS('*','link')[1].childNodes[0].nodeValue);
					});
	  
					chrome.notifications.create('', {
						title: 'Sri Lanka COVID-19 Updates',
						message: xmlDoc.getElementsByTagNameNS('*','title')[1].childNodes[0].nodeValue,
						iconUrl: 'images/logo128.png',
						type: 'basic'
					});
				}else{
					console.log("All updated !");
				}
	  
			});
		};
		x.send();
    }, 5000);
  }
});