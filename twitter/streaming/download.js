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
			fs.readdir(download_path, function(err, files){
				if (err) throw err;
				var fileId = {};
				for(var x of files){
					var id = x.match(/\(\d+\)$/);
					if(id){
						id[0] = id[0].slice(1,-1);
						fileId[id] = x;
					}
				}
				var count = 0;
				for(user_name in user_names){
					if(fileId[user_name] == null){
						fs.mkdirSync(download_path + "/" +　user_names[user_name], (err) => {
							count++;
						});
					}
					else if(fileId[user_name] != user_names[user_name]){
						fs.rename(download_path + "/" + fileId[user_name], download_path + "/" + user_names[user_name], function (err) {
							count++;
						});
					}
					else count++;
				}
				
				for(data in results) {
					var ext = "";
					var url = results[data].download_url;
					var exts = url.match(/[^.]+$/);
					if(exts){
						var extss = exts[0].match(/^[^:]+/);
						if(exts) ext = extss[0];
					}
					if(ext==""){
						console.log("file extension error");
						continue;
					}
					var path = download_path + "/" + user_names[results[data].tweet_id_str];
					var filename = results[data].media_id_str;
					if(results[data].photo_number) filename += "-" + results[data].photo_number;
					filename += "." + ext;
					var media_id_str = results[data].media_id_str;
					download(url, path, filename, media_id_str, fs, request, connection);
				}
			});
		});
    });
}

function download(url, path, filename, media_id_str, fs, request, connection) {
	var write = fs.createWriteStream(path + '/' + filename);
	request.get(url).on('response', function (res) {
		// console.log('statusCode: ', res.statusCode);
		// console.log('content-length: ', res.headers['content-length']);
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