function updateArtist(artist_id){
    $.ajax({
        url: '/artists/' + artist_id,
        type: 'PUT',
        data: $('#update-artist').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
