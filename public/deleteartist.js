function deleteArtist(artist_id){
    $.ajax({
        url: '/artists/' + artist_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
