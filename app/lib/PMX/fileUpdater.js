exports.downloadFile = function(_filename, _path, _progress)
{
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,_filename);
	if (file.exists()){
		Ti.App.fireEvent('file_downloaded');
		return;
	}
	
	var strFileName = _filename;
	var source = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), strFileName );
	var dest = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), strFileName );
	 
	if (source.exists() && (!dest.exists()) ) {
	    dest.write(source.read() );
	    Ti.App.fireEvent('file_downloaded');
	}
	else
	{
		getFileSize(_filename, _path, _progress);
	}
	source = null;
	dest = null;
	
	
	
	
	
	
	
};

function getFileFromServer(_filename, _path, _progress)
{
	
	_progress.show();
	var xhr = Titanium.Network.createHTTPClient({
		
		 ondatastream: function (event)
    	{
    		//Ti.API.info(event.progress);
    		if(_progress != null)
    		{
    			_progress.value=event.progress;
    		}
    	},
		
		onerror: function()
		{
			alert('Download error');
			//Alloy.Globals.webservice.removeLoader();
		},
	    onload: function(e) {
	    	/*
	    	//Supression de la base local existante
	    	var f = Ti.Filesystem.getFile(xhr.responseData.nativePath);
		    var dest = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,_filename);
		    if (dest.exists)
		      dest.deleteFile();
		    f.move(dest.nativePath);
			//Propriété : la base de données existe et peut être utilisée
			
			*/
			Ti.App.fireEvent('file_downloaded');
			xhr = null;
			

	    },
	    timeout: 10000
	});

	xhr.open('GET',_path+_filename);
	xhr.file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,_filename);
	xhr.send();
};

function getFileSize(_filename, _path, _progress)
{
	var xhr = Titanium.Network.createHTTPClient({

		onerror: function()
		{
			getFileFromServer(_filename, _path, _progress);
			//Alloy.Globals.webservice.removeLoader();
		},
	    onload: function(e) {
			//Ti.API.info( this.getResponseHeader('Content-Length') );
			xhr = null;
			getFileFromServer(_filename, _path, _progress);
			_progress.message = "current download... "+this.getResponseHeader('Content-Length')+"ko";

	    },
	    timeout: 10000
	});

	xhr.open('HEAD',_path+_filename);
	xhr.send();
}
