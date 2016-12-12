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

