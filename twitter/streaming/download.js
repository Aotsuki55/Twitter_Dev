exports.downloadMedia = function(connection) {
	var nconf = require('nconf');
	var fs = require('fs');
	var request = require('request');
	nconf.use('file', {
		file: '../../config/app.json'
	});
	nconf.load(function (err, conf) {
		if(err) throw err;
		var download_path = conf.download_path;
        connection.query('SELECT * FROM `media` WHERE `is_downloaded` = 0', function (error, results, fields) {
			var user_names = {};
			for(data in results) {
				user_names[results[data].tweet_id_str] = results[data].user_name + "(" + results[data].tweet_id_str + ")";
			}
			for(user_name in user_names){
				
			}
			for(data in results) {
				var url = results[data].download_url;
				var path = download_path;// + "/" +results[data];
				var filename = "zzz.jpg";
				var media_id_str = results[data].media_id_str;
				download(url, path, filename, media_id_str, fs, request, connection);
			}
		});
    });
}

function download(url, path, filename, media_id_str, fs, request, connection) {
	var write = fs.createWriteStream(path + '/' + filename);
	request.get(url).on('response', function (res) {
		console.log('statusCode: ', res.statusCode);
		console.log('content-length: ', res.headers['content-length']);
	})
	.pipe(write.on('finish',function(){
		connection.query(
			'update media set ? where `media_id_str` = "' + media_id_str + '" ',
			{
				is_downloaded: 1
			},
			function(error,results,fields) {
				if(error) {
					console.log(error);
				} 
			}
		);
    }));
}