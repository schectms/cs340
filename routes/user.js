module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getUsers(req, res, mysql, context, complete){
        var sql = "SELECT user.user_name, song.song_name, artist.artist_name, user.user_id FROM user INNER JOIN song ON user.sid = song.song_id INNER JOIN artist ON song.aid = artist.artist_id"
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.users = results;
            complete();
        });
    }

    function getUsersForDropDown(req, res, mysql, context){
        var sql = "SELECT user.user_name, user.user_id FROM user";
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.dropdown = results;
        });
    }

    function getSongsForDropdown(req, res, mysql, context){
        var sql = "SELECT song.song_name, artist.artist_name, song.song_id FROM song INNER JOIN artist ON song.aid = artist.artist_id";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.dropdown_songs = results;
            return context;
        });
    }

     /* READ - Display all users*/

     router.get('/', function(req, res){
        var context = {title: "Users", users: {}, dropdown_songs: {}};
        var mysql = req.app.get('mysql');
        getUsers(req, res, mysql, context, complete);
        function complete(){
            res.render('users', context);
        }
    });



    /* CREATE Adds a user */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO user (user_name, sid) VALUES (?, ?)";
        var inserts = [req.body.user.name, req.body.user.fav_song];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/user');
            }
        });
    });

    return router;
}();