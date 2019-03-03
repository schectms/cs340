module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getSongsByPlaylist(req, res, mysql, context, complete){
        var sql = "SELECT song.song_name, artist.artist_name, playlist.playlist_name FROM song_playlist INNER JOIN song ON song_playlist.sid = song.song_id INNER JOIN artist ON song.aid = artist.artist_id INNER JOIN playlist ON song_playlist.id = playlist.playlist_id  WHERE song_playlist.pid = ?";
        var inserts = ["3"]; // this needs to be the playlist id from the req
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.songs = results;
            complete();
        });
    }

    function getSongsByAlbum(req, res, mysql, context, complete){
        var sql = "SELECT song.song_name, artist.artist_name, album.album_name FROM song INNER JOIN artist ON artist.artist_id = song.aid INNER JOIN album ON artist_id = album.aid WHERE album.album_id = ?";
        var inserts = ["3"]; // this needs to be the album id from the req
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.songs = results;
            complete();
        });
    }

    function getSongsByArtist(req, res, mysql, context, complete){
        var sql = "SELECT song.song_name, artist.artist_name FROM song INNER JOIN artist ON artist.artist_id = song.aid WHERE song.aid = ?";
        var inserts = ["3"]; // this needs to be the artist id from the req
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
            getSongsByArtist(req, res, mysql, context, complete);
        }
        else if (filter_type = "album"){
            getSongsByAlbum(req, res, mysql, context, complete);
        }
        else if (filter_type = "playlist"){
            getSongsByPlaylist(req, res, mysql, context, complete);
        }
        function complete(){
            res.render('songs', context);
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