var id =-1
$(function(){
    $.get('http://localhost:7709/paras', function(data){
        data.forEach(function(data) {
            var edit = $("<button/>").addClass("childAlign").text("Editar")
            

            edit.click(function() {
                id = data._id
                $("#campo").val(data.para);
            })

            var apagar = $("<button/>").addClass("childAlign").text("Apagar")

            apagar.click(function() {
                id = data._id
                $.ajax({
                    url: 'http://localhost:7709/paras/delete/' + id,
                    type: 'DELETE',
                    success: function(response) {
                        alert("Item Successfully Deleted")
                        location.reload()
                    }
                });
                
            })
            var elem = $("<li><b>"+ data.data +":</b> " + data.para + "</li>")
                elem.append(edit).append(apagar)
                $("#paras").append(elem);
    })
})

$("#botaoAdd").click(function(){
    if (id == -1){
      $.post('http://localhost:7709/paras',$("#campo").serialize())
      alert('Parágrafo inserido: ' + ($("#campo").val()))
      $("#campo").val("")
      location.reload()
    }
    else{
        alert('http://localhost:7709/paras/editar/'+id)
      $.ajax({
        url: 'http://localhost:7709/paras/editar/'+id,
        type: 'PUT',
        data:$("#paraForm").serialize(),
        success: function(response) {
            alert('Parágrafo editado: ' + ($("#campo").val()));
            $("#campo").val("");
            id = -1;
            location.reload();
        }
      });
    }


})
});