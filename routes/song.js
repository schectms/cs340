module.exports = (function() {
	var express = require('express');
	var router = express.Router();

	function getSongsByPlaylist(req, res, mysql, context, complete) {
		var sql =
			"SELECT song.song_name, song_playlist.sid, artist.artist_name, playlist.playlist_name, user.user_name, 'true' AS chks, 'playlist' AS type FROM song_playlist INNER JOIN song ON song_playlist.sid = song.song_id INNER JOIN artist ON song.aid = artist.artist_id INNER JOIN playlist ON song_playlist.pid = playlist.playlist_id  INNER JOIN user ON playlist.uid = user.user_id WHERE song_playlist.pid = ?";
		var inserts = [ req.query.playlist_id ];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			if (results === undefined || results.length == 0) {
				context.info.name = 'No songs yet';
				context.info.type = 'Playlist';
				context.info.playlist = true;
				context.info.playlist_id = req.query.playlist_id;
				complete();
			} else {
				context.info.name = results[0].playlist_name + ' - ' + results[0].user_name;
				context.info.type = 'Playlist';
				context.info.playlist = true;
				context.info.playlist_id = req.query.playlist_id;
				context.songs = results;
				complete();
			}
		});
	}

	function getSongsByAlbum(req, res, mysql, context, complete) {
		var sql =
			'SELECT song.song_name, artist.artist_name, album.album_name, artist.artist_id, album.album_id,  "album" AS type FROM album INNER JOIN artist ON artist.artist_id = album.aid INNER JOIN song ON song.albumid = album.album_id WHERE album.album_id = ?';
		var inserts = [ req.query.album_id ];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			if (results === undefined || results.length == 0) {
				context.info.name = 'No songs yet';
				context.info.type = 'Album';
				context.info.album = true;
				context.info.artist_id = req.query.artist_id;
				context.info.album_id = req.query.album_id;
				complete();
			} else {
				context.info.name = results[0].album_name + ' - ' + results[0].artist_name;
				context.info.artist_id = req.query.artist_id;
				context.info.album_id = req.query.album_id;
				context.info.type = 'Album';
				context.info.album = true;
				context.songs = results;
				complete();
			}
		});
	}

	function getSongsByArtist(req, res, mysql, context, complete) {
		var sql =
			'SELECT song.song_name, artist.artist_name, artist.artist_id, "artist" AS type FROM song INNER JOIN artist ON artist.artist_id = song.aid WHERE song.aid = ?';
		var inserts = [ req.query.artist_id ];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			if (results === undefined || results.length == 0) {
				context.info.name = 'No songs yet';
				context.info.type = 'Artist';
				context.info.artist = true;
				context.info.artist_id = req.query.artist_id;
				complete();
			} else {
				context.info.name = results[0].artist_name;
				context.info.artist_id = results[0].artist_id;
				context.info.album_id = results[0].album_id;

				context.info.type = 'Artist';
				context.info.artist = true;
				context.songs = results;
				complete();
			}
		});
	}
	function getSongsForDropdown(req, res, mysql, context, complete) {
		var sql =
			'SELECT song.song_name, artist.artist_name, song.song_id FROM song INNER JOIN artist ON song.aid = artist.artist_id';
		mysql.pool.query(sql, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.dropdown_songs = results;
			complete();
		});
	}

	/* READ - Display songs by artist, album or playlist depending on filter_type in req */

	router.get('/', function(req, res) {
		var callbackCount = 0;
		var context = { info: {} };
		context.jsscripts = [ 'deleteSong.js' ];
		context.title = 'View Songs by ';
		var mysql = req.app.get('mysql');
		var filter_type = req.query.type;
		if (filter_type === 'artist') {
			getSongsByArtist(req, res, mysql, context, complete);
		} else if (filter_type === 'album') {
			getSongsByAlbum(req, res, mysql, context, complete);
		} else if (filter_type === 'playlist') {
			getSongsByPlaylist(req, res, mysql, context, complete);
		} else {
			res.render('404');
		}
		getSongsForDropdown(req, res, mysql, context, complete);
		function complete() {
			callbackCount++;
			if (callbackCount >= 2) {
				res.render('songs', context);
			}
		}
	});

	/* CREATE - Adds a song to artist, album or playlist depending on filter type in req 
    */

	router.post('/', function(req, res) {
		var mysql = req.app.get('mysql');
		var filter_type = req.query.type;
		var sql;
		var inserts;
		if (filter_type == 'artist') {
			sql = 'INSERT INTO song (song_name, aid) VALUES (?, ?)';
			inserts = [ req.body.song_name, req.query.artist_id ];
		} else if (filter_type == 'album') {
			sql = 'INSERT INTO song(song_name, aid, albumid) VALUES(?, ?, ?)';
			inserts = [ req.body.song_name, req.query.artist_id, req.query.album_id ];
		} else if (filter_type == 'playlist') {
			sql = 'INSERT INTO song_playlist(sid, pid) VALUES (?, ?)';
			inserts = [ req.body.playlist_song, req.query.playlist_id ];
		}
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.redirect(req.originalUrl);
			}
		});
	});

	router.delete('/:song_id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM song_playlist WHERE sid = ?';
		var inserts = [ req.params.song_id ];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			} else {
				res.status(202).end();
			}
		});
	});

	return router;
})();
