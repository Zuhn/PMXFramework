function jsonParser() {
	var callBack = null,
		loading = false,
		xhr = Titanium.Network.createHTTPClient();
	xhr.onerror= function()
	{
		callBack.call(this, false);
	};
	xhr.onload = function()
	{
		var data = {};
		try {
	        data = eval('(' + this.responseText + ')');
	    }
	    catch (err) {
	        Ti.API.info('response data => ' + this.responseText);
	        data = {};
	    }
	 	
	 	callBack.call(this, data);
	 	
	 	loading = false;
	 	
	 	xhr = null;
	}	;
	
	this.load = function(url, method, args, cb)
	{
		if (!loading)
		{			
			callBack = cb;
			loading = true;
		
			xhr.open(method, url);
			
			//pour qu'infomaniak ne refuse pas la requette post on set un user agent
			//inportant : a mettre JUSTE avant le send
			xhr.setRequestHeader('User-Agent','android');
			xhr.send(args);
		}
	};
	
	return this;
	
}

module.exports = jsonParser;