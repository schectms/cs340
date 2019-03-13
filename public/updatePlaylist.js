function updatePlaylist(playlist_id){
    $.ajax({
        url: '/playlists/' + playlist_id,
        type: 'PUT',
        data: $('#update-playlist').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
