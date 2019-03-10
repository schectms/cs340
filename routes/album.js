module.exports = (function() {
	var express = require('express');
	var router = express.Router();

	function getAlbumsByArtist(req, res, mysql, context, complete) {
		var sql =
			'SELECT album.album_name, artist.artist_name, album.album_id, artist.artist_id FROM album INNER JOIN artist ON artist.artist_id = album.aid WHERE album.aid = ?';
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

	function getAlbum(res, mysql, context, id, complete){
        var sql = "SELECT album.album_name, , album.album_id  FROM album WHERE album_id = ?";
        var inserts = [id]; // this needs to be the artist id from the req
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.album = results[0];
            complete();
        });
    }
	/* READ - Display all artist albums*/

	router.get('/', function(req, res) {
		let count = 0;
		var context = {};
		context.jsscripts = [ 'deleteAlbum.js' ];
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
	
	router.get('/:album_id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateAlbum.js"];
        var mysql = req.app.get('mysql');
        getAlbum(res, mysql, context, req.params.album_id, complete);
        function complete(){
                res.render('update-album', context);
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

	router.put('/:album_id', function(req, res){
        var mysql = req.app.get('mysql');
//        console.log(req.body)
        console.log(req.query.album_id);
        var sql="UPDATE album SET album_name = ? WHERE album_id=?";
	var inserts = [req.body.album_name, req.params.artist_id]
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();

            }
        });
    });
	router.delete('/:album_id', function(req, res) {
		var mysql = req.app.get('mysql');
		var sql = 'DELETE FROM album WHERE album_id = ?';
		var inserts = [ req.params.album_id ];
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
