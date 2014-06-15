exports.uploadFile = function(_filePath, _cb, _ind)
{
	//var uploadFile =  Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,Ti.App.Properties.getString('img_signature'));

	var data_to_send = { 
        "file": _filePath.read(),
        "file_name":"test.jpg"//Ti.App.Properties.getString('img_signature')
    };

    if(OS_IOS)
		var fileUploadUrl = Alloy.Globals.pathToServer+'upload_process.php';
	else
		var fileUploadUrl = Alloy.Globals.pathToServer+'upload_process_android.php';
		
		
	var xhr = Titanium.Network.createHTTPClient();
	
	xhr.onerror = function(e)
	{
		//Alloy.Globals.webservice.getAppText('app_title_box_error')
		_cb(false);
		Ti.UI.createAlertDialog({title:'Error', message: e.error}).show();
	};
	xhr.setTimeout(20000);
	xhr.onload = function(e)
	{
		//Ti.UI.createAlertDialog({title:'Success', message:'status code ' + this.status}).show();
		console.log(this.responseData);
		console.log(this.responseText);
		Ti.API.info('IN ONLOAD ' + this.status + ' readyState ' + this.readyState);
		_cb(true);
	};
	xhr.onsendstream = function(e)
	{
		_ind.message = ((Math.round((_filePath.size*e.progress)/100000))/10)+" Mo / "+Math.round((_filePath.size)/100000)/10+" Mo";
		//console.log(this.responseData);
		if(_ind != null)
		{
			_ind.value = e.progress;
		}
		//ind.value = e.progress ;
		Ti.API.info('ONSENDSTREAM - PROGRESS: ' + e.progress);
	};
	//xhr.setRequestHeader("enctype", "multipart/form-data");
    //xhr.setRequestHeader("Content-Type", "video/mov");
	// open the client
	xhr.open('POST',"http://www.processmx.com/AppPMX/upload/upload_process.php");
	
	
	// send the data
	xhr.send(data_to_send);

};