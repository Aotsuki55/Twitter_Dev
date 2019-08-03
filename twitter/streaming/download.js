exports.downloadMedia = function(connection) {
	connection.query('SELECT * FROM `tweet` WHERE `is_downloaded` = 0', function (error, results, fields) {
		for(data in results) {
			media = JSON.parse(results[data].medias);
			if(media==null||media.length==0)break;
			if(media.length==1){
				
			}
			else{
				
			}
		}
	});
}

function download(url, path, filename) {
	var fs = require('fs');
	var request = require('request');

	// ファイルをダウンロードする
	request.get(url).on('response', function (res) {
		console.log('statusCode: ', res.statusCode);
		console.log('content-length: ', res.headers['content-length']);
	})
	.pipe(fs.createWriteStream(path + '/' + filename));
}