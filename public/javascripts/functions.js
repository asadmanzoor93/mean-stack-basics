
$(function(){
    $('.kitten_delete').on('click', function(e) {
        e.preventDefault();
        var kittenId = $(this).attr('id');    
        $.ajax({
            method: 'delete',
            url: '/kittens/'+kittenId,
            dataType: 'html',
            success: function(response){
                if(response == 'success'){
                    $('#'+kittenId).remove();
                    alert('Kitten Record Deleted Successfully!');
                }
             },
         });
     });
     
     $('.story_delete').on('click', function(e) {
        e.preventDefault();
        var storyId = $(this).attr('id');    
        $.ajax({
            method: 'delete',
            url: '/story/'+storyId,
            dataType: 'html',
            success: function(response){
                if(response == 'success'){
                    $('#'+storyId).remove();
                    alert('Story Record Deleted Successfully!');
                }
             },
         });
     });
});