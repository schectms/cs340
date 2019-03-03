module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSongsByPlaylist(res, mysql, context, id, complete){
        var sql = "SELECT song.song_name, artist.artist_name, playlist.playlist_name FROM song_playlist INNER JOIN song ON song_playlist.sid = song.song_id INNER JOIN artist ON song.aid = artist.artist_id INNER JOIN playlist ON song_playlist.id = playlist.playlist_id  WHERE song_playlist.pid = ?";
        var inserts = [playlist_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.songs = results;
            complete();
        });
    }

    function getSongsByAlbum(res, mysql, context, id, complete){
        var sql = "SELECT song.song_name, artist.artist_name, album.album_name FROM song INNER JOIN artist ON artist.artist_id = song.aid INNER JOIN album ON artist_id = album.aid WHERE album.album_id = ?";
        var inserts = [album_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.songs = results;
            complete();
        });
    }

    function getSongsByArtist(res, mysql, context, id, complete){
        var sql = "SELECT song.song_name, artist.artist_name FROM song INNER JOIN artist ON artist.artist_id = song.aid WHERE song.aid = ?";
        var inserts = [artist_id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.songs = results;
            complete();
        });
    }
    
    /* READ - Display songs by artist, album or playlist depending on filter_type in req */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        var filter_type = req.body.type;
        if ( filter_type = "artist"){
            getSongsByArtist(res, mysql, context, complete);
        }
        else if (filter_type = "album"){
            getSongsByAlbum(res, mysql, context, complete);
        }
        else if (filter_type = "playlist"){
            getSongsByPlaylist(res, mysql, context, complete);
        }
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('songs', context);
            }

        }
    });

    /* CREATE - Adds a song to artist, album or playlist depending on filter type in req 
    */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var filter_type = req.body.type;
        var sql;
        var inserts;
        if ( filter_type = "artist"){
            sql = "INSERT INTO song (song_name, aid) VALUES (?, ?)";
            inserts = [req.body.song.name, req.body.song.artist_id];
        }
        else if (filter_type = "album"){
            sql = "INSERT INTO song(song_name, aid, album_id VALUES(?, ?, ?)";
            inserts = [req.body.song.name, req.body.song.artist_id, req.body.song.album_id];
        }
        else if (filter_type = "playlist"){
            sql = "INSERT INTO song_playlist(sid, pid) VALUES (?, ?)";
            inserts = [req.body.song.song_id, req.body.song.playlist_id];
        }
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/songs');
            }
        });
    });

    return router;
}();