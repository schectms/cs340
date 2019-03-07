function deleteSong(song_id){
    $.ajax({
        url: '/artists/' + song_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
