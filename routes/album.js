module.exports = (function() {
	var express = require('express');
	var router = express.Router();

	function getAlbumsByArtist(req, res, mysql, context, complete) {
		var sql =
			'SELECT album.album_name, artist.artist_name, album.album_id FROM album INNER JOIN artist ON artist.artist_id = album.aid WHERE album.aid = ?';
		var inserts = [ req.query.artist_id ];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.albums = results;
			complete();
		});
	}

	function getArtist(req, res, mysql, context, complete) {
		var sql = 'SELECT artist.artist_name, artist.artist_id FROM artist WHERE artist_id = ?';
		var inserts = [ req.query.artist_id ];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.artist = results[0];
			complete();
		});
	}

	/* READ - Display all artist albums*/

	router.get('/', function(req, res) {
		let count = 0;
		var context = {};
		var mysql = req.app.get('mysql');
		getAlbumsByArtist(req, res, mysql, context, complete);
		getArtist(req, res, mysql, context, complete);
		function complete() {
			count++;
			if (count >= 2) {
				res.render('albums', context);
			}
		}
	});

	/* CREATE - Adds an album */

	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = 'INSERT INTO album (album_name, aid) VALUES(?, ?)';
		var inserts = [ req.body.album_name, req.query.artist_id ];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.redirect('/albums?artist_id=' + req.query.artist_id);
			}
		});
	});

	return router;
})();
