function deletePlaylist(playlist_id){
    $.ajax({
        url: '/playlists/' + playlist_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
