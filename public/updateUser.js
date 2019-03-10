function updateUser(id){
    $.ajax({
        url: '/user/' + id,
        type: 'PUT',
        data: $('#update-user').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
