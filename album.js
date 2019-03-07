const express = require('express');
const mysql = require('./../dbcon.js');
const moment = require('moment');
const router = express.Router();

function getAlbum(req, res, mysql, context, complete) {
		var sql = 'SELECT album.album_name  FROM album WHERE album_id = ?';
		var inserts = [ req.query.album_id ];
		mysql.pool.query(sql, inserts, function(error, results, fields) {
			if (error) {
				res.write(JSON.stringify(error));
				res.end();
			}
			context.album = results[0];
			complete();
		});
	}

//returns table in JSON format 
router.get('/', (req, res, next) =>
{
    mysql.pool.query('SELECT album_name AS name FROM album', (err, rows, fields) => 
	  {
	      if (err)
        return next(err);
        res.json(rows)
    });
});

router.post('/insert', function(req, res, next)
{
	const placeholders = 
	[ req.album_id, req.album_name,	req.aid,];
	const query = 
	"INSERT INTO workouts (`album_id`, `album_name`, `aid`)
	VALUES (?, ?, ?)";	
	mysql.pool.query(query, placeholders, (err, result) => 
	{
		if (err)
		return next(err);
		req.body.id = result.insertId;
		res.json(req.body);

	});

});


