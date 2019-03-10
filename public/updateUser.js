function updateUser(user_id){
    $.ajax({
        url: '/users/' + user_id,
        type: 'PUT',
        data: $('#update-user').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
