var nconf = require('nconf');
nconf.use('file', {
    file: '../../config/app.json'
});
nconf.load(function (err, conf) {
    if (err) { 
    	throw err; 
    }

    var twitterModule = require('../connect.js');
    var twitter = twitterModule.getInstance(conf);

	var dbModule = require('../../database/' + conf.driver + '.js');
	var connection = dbModule.getConnection(conf);

	var streamingModule = require('./common.js');
	if(conf.driver != 'mongo') {
		dbModule.connect(connection, function() {
			if(conf.create_table) {
				dbModule.createTweetTable(connection, nconf);
			}
			streamingModule.getTweet2(twitter, connection, conf.driver, null);
		});
	} else {
		dbModule.connect(connection, function(db) {
			streamingModule.getTweet(twitter, connection, conf.driver, db);
		});
	}
	// var downloadModule = require('./download.js');
	// downloadModule.downloadMedia(connection);
});