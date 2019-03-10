module.exports = (function() {
	var express = require('express');
	var router = express.Router();

	function getUsers(req, res, mysql, context, complete) {
		var sql =
			'SELECT user.user_name, song.song_name, artist.artist_name, user.user_id FROM user INNER JOIN song ON user.sid = song.song_id INNER JOIN artist ON song.aid = artist.artist_id';
		mysql.pool.query(sql, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.users = results;
			complete();
		});
	}
	
	function getUser(res, mysql, context, id, complete){
        var sql = "SELECT user.user_id, user.user_name FROM user WHERE user.user_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.user = results[0];
            complete();
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

	/* READ - Display all users*/

	router.get('/', function(req, res) {
		let count = 0;
		router.delete('/:user_id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM user WHERE user_id = ?";
        var inserts = [req.params.user_id];
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
