module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPlaylists(res, mysql, context, complete){
        mysql.pool.query("SELECT playlist.name, user.user_name, playlist.playlist_id FROM playlist INNER JOIN user ON user.user_id = playlist.uid", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.playlists  = results;
            complete();
        });
    }

    function getUsersPlaylists(res, mysql, context, id, complete){
        var sql = "SELECT playlist.name, user.user_name, user.user_id FROM playlist INNER JOIN user ON user.user_id = playlist.uid WHERE user.user_id = ?";
        var inserts = [user_id];
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
        getPlaylists(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('artists', context);
            }

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