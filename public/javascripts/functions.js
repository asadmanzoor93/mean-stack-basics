
$(function(){
    $('.user_delete').on('click', function(e) {
        e.preventDefault();
        var userid = $(this).attr('id');    
        $.ajax({
            method: 'delete',
            url: '/kittens/'+userid,
            dataType: 'html',
            success: function(response){
                if(response == 'success'){
                    $('#'+userid).remove();
                    alert('Record Deleted Successfully!');
                }
             },
         });
     });
     
     $('.user_update').on('click', function(e) {
       e.preventDefault();
       var recordId = $(this).attr('id');    
       $.ajax({
           method: 'put',
           url: '/kittens/'+recordId,
           dataType: 'html',
           success: function(response){
               if(response == 'success'){
                   alert('Record Updated Successfully!');
               }
            },
        });
    });
});