module.exports = (function() {
	var express = require('express');
	var router = express.Router();

	function getPlaylists(req, res, mysql, context, complete) {
		mysql.pool.query(
			'SELECT playlist.playlist_name, user.user_name, playlist.playlist_id FROM playlist INNER JOIN user ON user.user_id = playlist.uid',
			function(error, results, fields) {
				if (error) {
					res.write(JSON.stringify(error));
					res.end();
				}
				context.playlists = results;
				complete();
			}
		);
	}
	
	function getPlaylist(res, mysql, context, id, complete) {
		var sql = 'SELECT playlist.playlist_name, playlist.uid,  playlist.playlist_id  FROM playlist WHERE playlist.playlist_id = ?';
		var inserts = [ id ]; // this needs to be the artist id from the req
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.playlist = results[0];
			complete();
		});
	}

	function getUsersPlaylists(req, res, mysql, context, complete) {
		var sql =
			'SELECT playlist.playlist_name, user.user_name, user.user_id FROM playlist INNER JOIN user ON user.user_id = playlist.uid WHERE user.user_id = ?';
		var inserts = [ '3' ]; // this needs to be the user id from the req
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.playlists = results;
			complete();
		});
	}

	function getUsersForDropDown(req, res, mysql, context, complete) {
		var sql = 'SELECT user.user_name, user.user_id FROM user';
		mysql.pool.query(sql, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.users_dropdown = results;
			complete();
		});
	}

	/* READ - Display all playlists*/

	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deletePlaylist.js"];
		var mysql = req.app.get('mysql');
		getPlaylists(req, res, mysql, context, complete);
		getUsersForDropDown(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 2) {
				res.render('playlists', context);
			}
		}
	});
	
	router.get('/:playlist_id', function(req, res) {
		let count = 0;
		var context = {};
		context.jsscripts = [ 'updatePlaylist.js', 'selectedPlaylist.js' ];
		var mysql = req.app.get('mysql');
		getPlaylist(res, mysql, context, req.params.playlist_id, complete);
		getUsersForDropDown(req, res, mysql, context, complete);
		function complete() {
			count++;
			if (count >= 2) {
				res.render('update-playlist', context);
			}
		}
	});

	/* CREATE - Adds a playlist */

	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = 'INSERT INTO playlist (playlist_name, uid) VALUES(?, ?)';
		var inserts = [ req.body.playlist_name, req.body.user_created ];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.redirect('/playlists');
			}
		});
	});
	
	router.put('/:playlist_id', function(req, res) {
		var mysql = req.app.get('mysql');
		console.log(req.params.playlist_id);
		var sql = 'UPDATE playlist SET playlist_name = ?, uid=? WHERE playlist_id=?';
		var inserts = [ req.body.playlist_name, req.body.playlist, req.params.playlist_id ];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				console.log(error);
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.status(200);
				res.end();
			}
		});
	});
	
	router.delete('/:playlist_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM playlist WHERE playlist_id = ?";
        var inserts = [req.params.playlist_id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

	return router;
})();
