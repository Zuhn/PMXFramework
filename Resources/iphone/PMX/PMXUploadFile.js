exports.uploadFile = function(_filePath, _cb, _ind) {
    var data_to_send = {
        file: _filePath.read(),
        file_name: "test.jpg"
    };
    Alloy.Globals.pathToServer + "upload_process.php";
    var xhr = Titanium.Network.createHTTPClient();
    xhr.onerror = function(e) {
        _cb(false);
        Ti.UI.createAlertDialog({
            title: "Error",
            message: e.error
        }).show();
    };
    xhr.setTimeout(2e4);
    xhr.onload = function() {
        console.log(this.responseData);
        console.log(this.responseText);
        Ti.API.info("IN ONLOAD " + this.status + " readyState " + this.readyState);
        _cb(true);
    };
    xhr.onsendstream = function(e) {
        _ind.message = Math.round(_filePath.size * e.progress / 1e5) / 10 + " Mo / " + Math.round(_filePath.size / 1e5) / 10 + " Mo";
        null != _ind && (_ind.value = e.progress);
        Ti.API.info("ONSENDSTREAM - PROGRESS: " + e.progress);
    };
    xhr.open("POST", "http://www.processmx.com/AppPMX/upload/upload_process.php");
    xhr.send(data_to_send);
};