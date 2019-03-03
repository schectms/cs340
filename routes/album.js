module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getAlbumsByArtist(res, mysql, context, id, complete){
        var sql = "SELECT album.album_name, artist.artist_name, album.album_id FROM album INNER JOIN artist ON artist.artist_id = album.aid WHERE album.aid = ?";
        var inserts = [artist_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.albums = results;
            complete();
        });
    }
    
    /* READ - Display all artist albums*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getAlbumsByArtist(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('artists', context);
            }

        }
    });

    /* CREATE - Adds an album */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO album (album_name, aid) VALUES(?, ?)";
        var inserts = [req.body.album.name, req.body.artist.artist_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/albums');
            }
        });
    });

    return router;
}();


