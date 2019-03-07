function deleteUser(user_id){
    $.ajax({
        url: '/users/' + user_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
