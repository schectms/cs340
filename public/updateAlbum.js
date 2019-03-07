function updateAlbum(album_id){
    $.ajax({
        url: '/albums/' + album_id,
        type: 'PUT',
        data: $('#update-album').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
