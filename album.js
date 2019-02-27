const express = require('express');
const mysql = require('./../dbcon.js');
const moment = require('moment');
const router = express.Router();

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



