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
        var sql = "SELECT user.user_name, user.sid,  user.user_id  FROM user WHERE user_id = ?";
        var inserts = [id]; // this needs to be the artist id from the req
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
		var context = { title: 'Users', users: {}, dropdown_songs: {} };
		context.jsscripts = ["deleteUser.js"];
		var mysql = req.app.get('mysql');
		getUsers(req, res, mysql, context, complete);
		getSongsForDropdown(req, res, mysql, context, complete);
		function complete() {
			count++;
			if (count >= 2) {
				res.render('users', context);
			}
		}
	});
	
	router.get('/:user_id', function(req, res){
        let count = 0;
        var context = {};
        context.jsscripts = ["updateUser.js", "selectedSong.js"];
        var mysql = req.app.get('mysql');
        getUser(res, mysql, context, req.params.user_id, complete);
        getSongsForDropdown(req, res, mysql, context, complete);
        function complete(){
            count++;
            if(count >= 2){
                res.render('update-user', context);
            }

        }
    });


	/* CREATE Adds a user */

	router.post('/', function(req, res) {
		console.log(req.body);
		var mysql = req.app.get('mysql');
		var sql = 'INSERT INTO user (user_name, sid) VALUES (?, ?)';
		var inserts = [ req.body.user_name, req.body.fav_song ];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			} else {
				res.redirect('/users');
			}
		});
	});
	
	router.put('/:user_id', function(req, res){
        var mysql = req.app.get('mysql');
//        console.log(req.body)
        console.log(req.params.user_id);
        var sql="UPDATE user SET user_name = ? WHERE user_id=?";
	var inserts = [req.body.user_name,  req.params.user_id];
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
