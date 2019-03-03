module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlaylists(req, res, mysql, context, complete){
        mysql.pool.query("SELECT playlist.playlist_name, user.user_name, playlist.playlist_id FROM playlist INNER JOIN user ON user.user_id = playlist.uid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.playlists  = results;
            complete();
        });
    }

    function getUsersPlaylists(req, res, mysql, context, complete){
        var sql = "SELECT playlist.playlist_name, user.user_name, user.user_id FROM playlist INNER JOIN user ON user.user_id = playlist.uid WHERE user.user_id = ?";
        var inserts = ["3"]; // this needs to be the user id from the req
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.playlists = results;
            complete();
        });
    }
    
    /* READ - Display all playlists*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getPlaylists(req, res, mysql, context, complete);
        function complete(){
            res.render('playlists', context);
        }
    });

    /* CREATE - Adds a playlist */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO playlist (playlist_name, uid) VALUES(?, ?)";
        var inserts = [req.body.playlist.name, req.body.playlist.user_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/playlists');
            }
        });
    });

    return router;
}();