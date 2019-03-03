module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getArtists(req, res, mysql, context, complete){
        mysql.pool.query("SELECT artist.artist_name, artist.artist_genre, artist.artist_bio, artist.artist_id FROM artist", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.artists  = results;
            complete();
        });
    }

     
    function getArtist(req, res, mysql, context, complete){
        var sql = "SELECT artist.artist_name, artist.artist_genre, artist.artist_bio, artist.artist_id AS id FROM artist WHERE artist_id = ?";
        var inserts = ["3"]; // this needs to be the artist id from the req
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }

    function getArtistsForDropDown(req, res, mysql, context, id, complete){
        var sql = "SELECT artist.artist_name, artist.artist_id FROM artist";
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results;
            complete();
        });
    }

   

    /* READ - Display all artists*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getArtists(req, res, mysql, context, complete);
        function complete(){
            res.render('artists', context);
        }
    });

    /* CREATE - Adds an artist */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO artist (artist_name, artist_genre, artist_bio) VALUES (?, ?, ?)";
        var inserts = [req.body.artist.name, req.body.artist.genre, req.body.artist.bio];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/artists');
            }
        });
    });

    return router;
}();