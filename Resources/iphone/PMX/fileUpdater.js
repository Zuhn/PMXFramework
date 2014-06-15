function getFileFromServer(_filename, _path, _progress) {
    _progress.show();
    var xhr = Titanium.Network.createHTTPClient({
        ondatastream: function(event) {
            null != _progress && (_progress.value = event.progress);
        },
        onerror: function() {
            alert("Download error");
        },
        onload: function() {
            Ti.App.fireEvent("file_downloaded");
            xhr = null;
        },
        timeout: 1e4
    });
    xhr.open("GET", _path + _filename);
    xhr.file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, _filename);
    xhr.send();
}

function getFileSize(_filename, _path, _progress) {
    var xhr = Titanium.Network.createHTTPClient({
        onerror: function() {
            getFileFromServer(_filename, _path, _progress);
        },
        onload: function() {
            xhr = null;
            getFileFromServer(_filename, _path, _progress);
            _progress.message = "current download... " + this.getResponseHeader("Content-Length") + "ko";
        },
        timeout: 1e4
    });
    xhr.open("HEAD", _path + _filename);
    xhr.send();
}

exports.downloadFile = function(_filename, _path, _progress) {
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, _filename);
    if (file.exists()) {
        Ti.App.fireEvent("file_downloaded");
        return;
    }
    var strFileName = _filename;
    var source = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(), strFileName);
    var dest = Ti.Filesystem.getFile(Ti.Filesystem.getApplicationDataDirectory(), strFileName);
    if (source.exists() && !dest.exists()) {
        dest.write(source.read());
        Ti.App.fireEvent("file_downloaded");
    } else getFileSize(_filename, _path, _progress);
    source = null;
    dest = null;
};