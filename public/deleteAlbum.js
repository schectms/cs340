function deleteAlbum(album_id){
    $.ajax({
        url: '/albums/' + album_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
