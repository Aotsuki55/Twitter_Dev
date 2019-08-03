exports.getTweet = function(twitter, connection, driver, db) {
	twitter.stream('statuses/sample', function(stream) {
	 	stream.on('data', function (data) {
	  		// if(data.lang == 'ja') {
    			var databaseClientModule = require('./' + driver + '.js');
    			if(driver != 'mongo') {
 					databaseClientModule.saveTweet(formatTweet(data), connection);
 				} else {
 					databaseClientModule.saveTweet(formatTweet(data), db);
 				}
			// }
	  	});
	});
}

exports.getTweet2 = function(twitter, connection, driver, db) {
	var databaseClientModule = require('./' + driver + '.js');
	let since_id_str = "";
	let new_since_id;
	let new_since_id_str = "";
	let new_Date;
	connection.query(
		'SELECT * FROM `updateId`',
		function (error, results, fields) {
			if(error) console.log(error);
			else since_id_str=results[0].newestId_str;
			if(since_id_str=="")since_id_str=null;
			const params = {since_id: since_id_str, count: 200};
			twitter.get('statuses/home_timeline', params, function(error, tweets, response) {
				// console.log(tweets);
				if(error){
					console.log(error);
				}
				else{
					for(data in tweets) {
						if(tweets[data].extended_entities) {
							if(tweets[data].retweeted_status!=null){
								databaseClientModule.saveTweet(formatTweet(tweets[data].retweeted_status), connection);
							}
							else{
								databaseClientModule.saveTweet(formatTweet(tweets[data]), connection);
							}
						}
						if(new_since_id_str.length<tweets[data].id_str.length||(new_since_id_str.length==tweets[data].id_str.length&&new_since_id_str<tweets[data].id_str)){
							new_since_id = BigInt(tweets[data].id);
							new_since_id_str = tweets[data].id_str;
							new_Date = formatDate(tweets[data].created_at);
						}
					}
					if(tweets.length!=0){
						connection.query(
							'update updateId set ?',
							{
								newestId: new_since_id,
								newestId_str: new_since_id_str,
								newestDate: new_Date,
								updated_at: new_Date
							},
							function(error,results,fields) {
								if(error) {
									console.log(error);
								} 
							}
						);
					}
				}
			});
		}
	);
}

function formatTweet(data) {
	data.createdAt = formatDate(data.created_at);

	if(data.entities.hashtags.length != 0) {
		data.entities.hashtags = JSON.stringify(data.entities.hashtags);
	} else {
		data.entities.hashtags = null;
	}

	if(data.entities.symbols.length != 0) {
		data.entities.symbols = JSON.stringify(data.entities.symbols);
	} else {
		data.entities.symbols = null;
	}

	if(data.entities.user_mentions.length != 0) {
		data.entities.user_mentions = JSON.stringify(data.entities.user_mentions);
	} else {
		data.entities.user_mentions = null;
	}

	if(data.entities.urls.length != 0) {
		data.entities.urls = JSON.stringify(data.entities.urls);
	} else {
		data.entities.urls = null;
	}

	if(data.extended_entities != undefined) {
		data.medias = JSON.stringify(data.extended_entities.media);
	} else {
		data.medias = null;
	}

	if(data.geo != null) {
		data.geo = JSON.stringify(data.entities.geo);
	} 
	if(data.coordinates != null) {
		data.coordinates = JSON.stringify(data.entities.coordinates);
	}
	if(data.place != null) {
		data.place_name = data.place.full_name;
		data.country_code = data.place.country_code;
		data.place = JSON.stringify(data.place);
	} else {
		data.place_name = null;
		data.country_code = null;
	}

	if(data.possibly_sensitive != undefined) {
		data.is_sensitive = false;
	}

	return data;
}

function formatDate(date) {
	var obj = new Date(Date.parse(date));
	var str = obj.getFullYear();
	str += '-';
	str += parseInt(obj.getMonth()) + 1;
	str += '-'; 
	str += obj.getDate();
	str += ' ';
	str += obj.getHours();
	str += ':';
	str += obj.getMinutes();
	str += ':';
	str += obj.getSeconds();
	return str;
}

