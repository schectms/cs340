function deleteSong(song_id){
    $.ajax({
        url: '/songs/' + song_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
