-- Manipulation Queries for Music Database

-- SELECT USERS

-- get all users and their favorite song
-- and artist to population users page
SELECT user.user_name, song.song_name, artist.name 
FROM user
INNER JOIN song ON user.sid = song.song_id
INNER JOIN artist ON song.aid = artist.artist_id

-- select all user to display on add playlist dropdown dialog
SELECT user.user_name FROM user


-- SELECT PLAYLISTS

-- select all playlists
SELECT playlist.name, user.user_name
FROM playlist
INNER JOIN user ON user.user_id = playlist.uid

-- select a users playlists to display on user's playlist page
SELECT playlist.name, user.user_name
FROM playlist
INNER JOIN user ON user.user_id = playlist.uid
WHERE user.user_id = :[USER SELECTED BY LINK]


-- SELECT ARTISTS

-- select all artists to display on artists page
SELECT artist.artist_name, artist.artist_genre, artist.artist_bio
FROM artist

-- select all aritsts to display on add song dropdown dialog
SELECT artist.artist_name FROM artist


-- SELECT ALBUMS

-- select all albums from a particular artist
SELECT album.album_name, artist.artist_name
FROM album
INNER JOIN artist ON artist.artist_id = album.aid
WHERE album.aid = :USER SELECTED BY LINK]


-- SELECT SONGS by playlist, artist, or album

-- select all songs within a playlist to display on playlist page
SELECT song.song_name, artist.artist_name, playlist.playlist_name
FROM song_playlist
INNER JOIN song ON song_playlist.sid = song.song_id
INNER JOIN artist ON song.aid = artist.artist_id
INNER JOIN playlist ON song_playlist.id = playlist.playlist_id 
WHERE song_playlist.pid = :[USER SELECTED BY LINK]

-- select songs by a single artist
-- to display when user clicks artist's songs
SELECT song.song_name, artist.artist_name
FROM song
INNER JOIN artist ON artist.artist_id = song.aid
WHERE song.aid = :[USER SELECTED BY LINK]

-- select songs from a single album
-- to display when user clicks on an album
SELECT song.song_name, artist.artist_name, album.album_name
FROM song
INNER JOIN artist ON artist.artist_id = song.aid
INNER JOIN album ON artist_id = album.aid
WHERE album.album_id = :[USER SELECTED BY LINK]


-- INSERTS

-- add new user
INSERT INTO user (user_name) VALUES (:user_name)

-- add new playlist
INSERT INTO playlist (playlist_name, uid) VALUES(:playlist_name_input, :user_id_from_dropdown)

-- add new album
INSERT INTO album (album_name, aid) VALUES(:album_name_input, :get_artist_id_from_page)

-- add song to playlist
INSERT INTO song_playlist(sid, pid) VALUES (:song_from_input, :pid_from_playlist_page)

-- add song to album
INSERT INTO song(song_name, aid, album_id VALUES(:song_from_input, :artist_id_from_page, :album_id_from_page)

-- add song to artist
INSERT INTO song (song_name, aid) VALUES (:song_name_from_input, :aid_from_page)


--UPDATES

-- update song
UPDATE song SET song_name = :sname_input, album_id = :albums_dropdown WHERE song_id = :song_id_from_button

-- update user
UPDATE user SET user_name = :uname_input, sid = :songs_dropdown_favsong WHERE user_id = :user_id_from_userpage

--update album
UPDATE album SET album_name = :aname_input, artist_id = :artist_dropdown WHERE album_id = :album_id_from_albumpage

-- update playlist
UPDATE playlist SET playlist_name = :pname_input, user_id = :uid_dropdown WHERE playlist_id = :playlist_id_from_plalistpage

-- update artist
UPDATE artist SET artist_name = :aname_input, artist_genre = :ag_input, artist_bio = :ab_input WHERE artist_id = :artist_id_from_artistpage


-- DELETES

-- delete a song
DELETE FROM song WHERE song_id = :song_ID_selected_from_button

-- delete an user
DELETE FROM user WHERE user_id = :user_ID_selected_from_button

-- delete an album
DELETE FROM album WHERE song_id = :album_ID_selected_from_button

-- delete a playlist
DELETE FROM playlist WHERE playlist_id = :playlist_ID_selected_from_button

-- delete an artist
DELETE FROM artist WHERE artist_id = :artist_ID_selected_from_button
