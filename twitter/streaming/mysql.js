exports.saveTweet = function(data, connection) {

	var result = connection.query(
		"insert into tweet set ?" ,
		{
			tweet_id: BigInt(data.id), 
			tweet_id_str: data.id_str, 
			user_id: data.user.id, 
			user_id_str: data.user.id_str, 
			user_name: data.user.name,
			user_screen_name: data.user.screen_name,
			content: data.text, 
			created_at: data.createdAt,
			is_truncated: data.truncated,
			hashtags: data.entities.hashtags, 
			symbols: data.entities.symbols, 
			user_mentions: data.entities.user_mentions, 
			urls: data.entities.urls, 
			medias: data.medias,
			source: data.source, 
			geo: data.geo,
		 	coordinates: data.coordinates,
		 	place: data.place,
		 	place_name: data.place_name,
		 	country_code: data.country_code,
			reply_tweet_id: data.in_reply_to_status_id,
			reply_tweet_id_str: data.in_reply_to_status_id_str,
			reply_user_id: data.in_reply_to_user_id, 
			reply_user_id_str: data.in_reply_to_user_id_str, 
			reply_screen_name: data.in_reply_to_screen_name,
			is_quoted: data.is_quote_status,
			retweet_count: data.retweet_count,
			favorite_count: data.favorite_count,
			is_retweeted: data.retweeted,
			is_favorited: data.favorited,
			is_sensitive: data.is_sensitive,
			lang: data.lang,
			is_downloaded: 0
		},
		function(error,results,fields) {
			if(error && error.code!="ER_DUP_ENTRY") {
				console.log(error);
			} 
		}
	);
}

exports.saveDate = function(data, connection) {

	var result = connection.query(
		'SELECT * FROM `user` WHERE `user_id_str` = "' + data.user.id_str + '" ',
		function (error, results, fields) {
			if(error) {
				console.log(error);
			}
			else if(results.length==null||results.length==0){
				var result2 = connection.query(
					"insert into tweet set ?",
					{
						user_id: data.user.id, 
						user_id_str: data.user.id_str, 
						user_name: data.user.name,
						user_screen_name: data.user.screen_name,
						oldestId: data.id,
						oldestId_str: data.id_str,
						newestId: data.data.id,
						newestId_str: data.data.id_str,
						oldestDate: data.createdAt,
						newestDate: data.createdAt,
						updated_at: data.createdAt
					},
					function(error,results,fields) {
						if(error) {
							console.log(error);
						}
					}
				);
			}
			else{
				if(results.oldestId_str.length>data.user.id_str.length||(results.oldestId_str.length==data.user.id_str.length&&results.oldestId_str>data.user.id_str)){
					var result3 = connection.query(
						'update user set ? where `user_id_str` = "' + data.user.id_str + '" ',
						{
							oldestId: data.id,
							oldestId_str: data.id_str,
							oldestDate: data.createdAt
						},
						function(error,results,fields) {
							if(error) {
								console.log(error);
							} 
						}
					);
				}
				if(results.newestId_str.length<data.user.id_str.length||(results.newestId_str.length==data.user.id_str.length&&results.newestId_str<data.user.id_str)){
					var result4 = connection.query(
						'update user set ? where `user_id_str` = "' + data.user.id_str + '" ',
						{
							newestId: data.id,
							newestId_str: data.id_str,
							newestDate: data.createdAt
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