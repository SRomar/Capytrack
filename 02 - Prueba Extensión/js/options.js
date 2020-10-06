var itemLista;
var itemProducto;
var lista = false;
var producto = false;
var listaSeleccionada;

$(document).ready(function(){
    if($( "#listaDeListas" ).val() !== null){
      chrome.storage.sync.get(null, function(items) {
          var allKeys = Object.keys(items);
          for (i = 0; i < allKeys.length; i++) {

              //$("#listaDeListas").append('<li><a class="elementoLista" href="#">'+allKeys[i]+'</a></li>');  
              $("#listaDeListas").append('<li class="elementoLista" id="'+allKeys[i]+'">'+allKeys[i]+'</li>');  

          }
         
        document.querySelectorAll('.elementoLista').forEach(item => {
          // item.addEventListener('click', event => {
          $(item).on('click', function() {
              
              $('#productosUl').empty()
                var nombreLista = $(this).text(); //Obtiene el nombre de li
                listaSeleccionada = nombreLista;
                chrome.storage.sync.get(nombreLista, function (lista) { //Obtiene la lista
                
                  $.map(lista, function(productosEnLista, nombreProducto) { //Obtiene los productos en la lista
                
                      $.map(productosEnLista, function(producto, llaveProducto) {  //Separa los productos
      
                        $.map(producto, function(datosProducto, categoryID) { //Separa los datos del producto

                          $("#productosUl").append('<li class="productoEnLista" id="'+datosProducto[5]+'">'+datosProducto[0]+'</li>'); //De aca se pueden sacar los datos del producto usando el indice
                           
                          var identificacion = "#"+datosProducto[5];

                          $(identificacion).on('click', function() {
  
                            $('#contenedorImagen').empty()
                      


                            $("#contenedorImagen").append('<img src="'+datosProducto[4]+'" class="imagenProducto" alt="celular"></img>');
                            nombre.innerHTML = datosProducto[0];
                            estado.innerHTML = datosProducto[2];      
                            precio.innerHTML = datosProducto[1];
                            urlProducto.innerHTML = '<a href="'+datosProducto[3]+'">ver</a>';

                          });



                    
                  });
                });
              });
            });
          });   
        });
      }); 
  
    }

  

    
    $("#menu").hide();

    $(document).bind("contextmenu", function(e){
      comprobacion();
      return false;
    });
    
    function comprobacion(){

      $("#listaDeListas").mousedown(function(e){
        if(e.button == 2){
          producto = false;
          lista = true;
          itemLista = $(e.target).text();

          if(itemLista.toString() == ''){
            lista = false;
          }
          $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
        }
      });

      $("#productosUl").mousedown(function(e){
        if(e.button == 2){
          lista = false;
          producto = true;
          itemProducto = $(e.target).text();

          if(itemProducto.toString() == ''){
            producto = false;
          }
          $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
        }
      });
    }
    
    

    $("#eliminar").click(function(e){

      if(lista == true){
        chrome.storage.sync.remove(itemLista);
      }
      else if(producto == true){
        var productosLista = [];
        var listaNueva = {};
        var existe = false;



        chrome.storage.sync.get(listaSeleccionada, function (lista) { //Obtiene la lista
            
          $.map(lista, function(productosEnLista, listaSeleccionada) { //Obtiene los productos en la lista
            
            
            $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
              
              
              $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
                if(datosProducto[0] !== itemProducto){
                  productosLista.push(producto);
                }
                else if(datosProducto[0] == itemProducto){
                  existe = true;
                }
              });
            });
          });
          if(existe == true){
            listaNueva[listaSeleccionada] = productosLista;        
            chrome.storage.sync.remove(listaSeleccionada);
            chrome.storage.sync.set(listaNueva);
          }
          
        });

        

      }
     location.reload();
     
      lista = false;
      producto = false;
    });

    /*$("#menu").mouseleave(function(){
      $("#menu").hide();
    });*/

    $(window).click(function() {
      lista = false;
      producto = false;
      producto = false;
     $("#menu").hide();
      });

  });


  $(document).on('click','#btnSeguimientos', function() {

    
    $("#suscripcionesHTML").hide();
    $("#h2SuscripcionesHTML").hide();
    $("#configuracionContenedor").hide();
    $("#contactoContenedor").hide();
    $('#productosUl > li').remove();


    $("#btnConfiguracion").css("background-color","#C4C4C4");
    $("#btnSuscripciones").css("background-color","#C4C4C4");
    $("#btnContacto").css("background-color","#C4C4C4");
    $("#btnSeguimientos").css("background-color","#858585");


    $("#seguimientosHTML").show();
  });
  
  $(document).on('click','#btnSuscripciones', function() {
    
    $("#seguimientosHTML").hide();
    $("#configuracionContenedor").hide();
    $("#contactoContenedor").hide();
    $('#productosUl > li').remove();


    $("#btnSeguimientos").css("background-color","#C4C4C4")
    $("#btnConfiguracion").css("background-color","#C4C4C4");
    $("#btnContacto").css("background-color","#C4C4C4");
    $("#btnSuscripciones").css("background-color","#858585");

    $("#h2SuscripcionesHTML").show();
    $("#suscripcionesHTML").show();
  
});

$(document).on('click','#btnConfiguracion', function() {

  $("#seguimientosHTML").hide();
  $("#suscripcionesHTML").hide();
  $("#h2SuscripcionesHTML").hide();
  $("#contactoContenedor").hide();
  $('#productosUl > li').remove();

  $("#btnSeguimientos").css("background-color","#C4C4C4");
  $("#btnContacto").css("background-color","#C4C4C4");
  $("#btnSuscripciones").css("background-color","#C4C4C4");
  $("#btnConfiguracion").css("background-color","#858585");


  $("#configuracionContenedor").show();

});
  
$(document).on('click','#btnContacto', function() {

  $("#seguimientosHTML").hide();
  $("#suscripcionesHTML").hide();
  $("#h2SuscripcionesHTML").hide();
  $("#configuracionContenedor").hide();
  $('#productosUl > li').remove();


  $("#btnSeguimientos").css("background-color","#C4C4C4");
  $("#btnContacto").css("background-color","#858585");
  $("#btnSuscripciones").css("background-color","#C4C4C4");
  $("#btnConfiguracion").css("background-color","#C4C4C4");


  $("#contactoContenedor").show();

});
  


  