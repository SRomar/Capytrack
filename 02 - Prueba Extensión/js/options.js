var listaSeleccionada;

$(document).ready(function(){

  EventosBotones();
  DesplegarListas();
  EventoListas();
  CrearContextMenu();
  obtenerSessionId();
});

async function getearSessionId(){
  var p = new Promise(function(resolve, reject){
    chrome.storage.local.get(['sessionId_NUEVO'], function(result){
      var id = result.sessionId_NUEVO;
      resolve(id); 
    });
  });
  const id = await(p);
  return id;
}

function obtenerSessionIdABM(id){
  chrome.storage.local.get(['sessionId_NUEVO'], function(result){
    var sessionId_anterior = result.sessionId_NUEVO;
    console.log("sessionId_anterior: " + sessionId_anterior);
    chrome.storage.local.set({'sessionId_NUEVO': id}, function(){
      console.log("sessionId_NUEVO: " + id);
    });
    var sessionIds = {
      idAnterior: sessionId_anterior,
      idNuevo: id
    }

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/updateSessionId",
      data: sessionIds
    });

  });
 

} 

function obtenerSessionId(){
  fetch('http://localhost:3000/session').then(data => data.text()).then(data =>{
    var i = data;
    console.log("i: " + i);
    chrome.storage.local.get(['sessionId_NUEVO'], function(result){
      var sessionId_anterior = "";
      if(result.sessionId_NUEVO !== undefined){
        sessionId_anterior = result.sessionId_NUEVO;
        console.log("sessionId_anterior: " + sessionId_anterior);
      }
      chrome.storage.local.set({'sessionId_NUEVO': i}, function() {
        console.log('sessionId_NUEVO: ' + i);
      });
      var sessionIds = {
        idAnterior: sessionId_anterior,
        idNuevo: i 
      }

      $.ajax({
        type: "POST",
        url: "http://localhost:3000/updateSessionId",
        data: sessionIds
      });
    });
     
  });
}


function EventosBotones(){
  $(document).on('click','#btnSeguimientos', function() {
      window.location.replace("options.html");
    });
    
  $(document).on('click','#btnSuscripciones', function() {
      window.location.replace("suscripciones.html");
  });

  $(document).on('click','#btnConfiguracion', function() {
    window.location.replace("configuracion.html");
  });
    
  $(document).on('click','#btnContacto', function() {
    window.location.replace("contacto.html");
});
}

function DesplegarListas(){
  if($( "#listasUl" ).val() !== null){
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        $("#listasUl").empty();
        for (i = 0; i < allKeys.length; i++) {
            $("#listasUl").append('<li class="elementoLista" id="'+allKeys[i]+'">'+allKeys[i]+'</li>');
        }

    });
  } 
}

function EventoListas(){
  chrome.storage.sync.get(null, function(items) {
  document.querySelectorAll('.elementoLista').forEach(item => {

    $(item).on('click', function() {      
      $('#productosUl').empty()
      var nombreLista = $(this).text(); //Obtiene el nombre de li
      listaSeleccionada = nombreLista;
      DesplegarProductos(nombreLista);
    });  
  });
  });
}

function DesplegarProductos(nombreLista){
  chrome.storage.sync.get(nombreLista, function (lista) { //Obtiene la lista

    $.map(lista, function(productosEnLista, nombreProducto) { //Obtiene los productos en la lista
  
        $.map(productosEnLista, function(producto, llaveProducto) {  //Separa los productos

          $.map(producto, function(datosProducto, categoryID) { //Separa los datos del producto

            $("#productosUl").append('<li class="productoEnLista" id="'+datosProducto[5]+'">'+datosProducto[0]+'</li>'); //De aca se pueden sacar los datos del producto usando el indice
        
            var idProducto = "#"+datosProducto[5];
            EventoProducto(idProducto, datosProducto);
            
        });
      });
    });
  });
}

function EventoProducto(idProducto, datosProducto){
      $(idProducto).on('click', function() {
        $('#contenedorImagen').empty()
        $("#contenedorImagen").append('<img src="'+datosProducto[4]+'" class="imagenProducto" alt="celular"></img>');
        nombre.innerHTML = datosProducto[0];
        estado.innerHTML = datosProducto[2];      
        precio.innerHTML = datosProducto[1];
        urlProducto.innerHTML = '<a href="'+datosProducto[3]+'">ver</a>';
    });
}


function CrearContextMenu(){
  $(document).bind("contextmenu", function(e){
    EventoOcultarMenu();
    Comprobacion();
    EventoCambiarNombreLista();
    EventoFondo();
    return false;
  });
}

function Comprobacion(){

  $(".elementoLista").mousedown(function(e){
    if(e.button == 2){
   
      itemLista = $(e.target).text();
      itemSeleccionado.innerHTML = " "+itemLista;
      document.getElementById("cambiarNombreLista").style.display = "inline";
      EventoEliminarLista(itemLista);
      $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
    }
  });

  $(".productoEnLista").mousedown(function(e){
    if(e.button == 2){

      itemProducto = $(e.target).text();
      itemSeleccionado.innerHTML = " "+itemProducto;
      document.getElementById("cambiarNombreLista").style.display = "none";
      EventoEliminarProducto(itemProducto);
      $("#menu").css({'display':'block', 'left':e.pageX, 'top':e.pageY});
    }
  });
}

function EventoCambiarNombreLista(){ 
  $("#cambiarNombreLista").unbind().click(function(e){

      var resp = window.prompt("Nuevo nombre:");
      var existe = false;

      if(resp != null && resp != ""){

        chrome.storage.sync.get(null, function(items) {
          var allKeys = Object.keys(items);
          for (i = 0; i < allKeys.length; i++) {
              if(resp == allKeys[i]){
                existe = true;
              }
          }
          if(existe == false){
            var productosLista = [];
            var listaNueva = {};

            chrome.storage.sync.get(itemLista, function (lista) { //Obtiene la lista
                
              $.map(lista, function(productosEnLista, itemLista) { //Obtiene los productos en la lista
                
                
                $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
                  
                  
                  $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
                      productosLista.push(producto);
                  });
                });
              });
              
              listaNueva[resp] = productosLista;        
              chrome.storage.sync.remove(itemLista);
              chrome.storage.sync.set(listaNueva);
              
              getearSessionId().then(id => {
                var listaServidor = {
                  nombreViejo: itemLista,
                  nombreNuevo: resp,
                  sessionId: id
                }
      
                var request = $.ajax({
                  type: "POST",
                  url: "http://localhost:3000/modificarLista",
                  data: listaServidor
                });
                request.done(function(response) {
                  console.log(response);
                  obtenerSessionIdABM(response.sessionId);
                });
              });
              
            });
            location.reload();
          }
          else if(existe == true){
            alert("Ya hay una lista con ese nombre!");
          }
        });
      }
     

  });
}

function EventoEliminarProducto(itemProducto){
  $("#eliminar").unbind().click(function(e){
      var productosLista = [];
      var listaNueva = {};
      var existe = false;
      var id;

      chrome.storage.sync.get(listaSeleccionada, function (lista) { //Obtiene la lista
          
        $.map(lista, function(productosEnLista, listaSeleccionada) { //Obtiene los productos en la lista
          
          
          $.map(productosEnLista, function(producto, llaveProducto) {  //Separa a los productos
            
            
            $.map(producto, function(datosProducto, categoryID) { //Separa a los datos del producto
              if(datosProducto[0] !== itemProducto){
                productosLista.push(producto);
              }
              else if(datosProducto[0] == itemProducto){
                existe = true;
                id = categoryID;
              }
            });
          });
        });
        if(existe == true){
          getearSessionId().then(idsession => {
            var productoServidor = {            
              id: id,
              sessionId: idsession
            }

            var request = $.ajax({
              type: "POST",
              url: "http://localhost:3000/bajaProducto",
              data: productoServidor
            });
            request.done(function(response) {
              console.log(response);
              obtenerSessionIdABM(response.sessionId);
            });
          });

          listaNueva[listaSeleccionada] = productosLista;        
          chrome.storage.sync.remove(listaSeleccionada);
          chrome.storage.sync.set(listaNueva);
        }
        
      });
      
      setTimeout(function (){
        $('#productosUl').empty();
        DesplegarProductos(listaSeleccionada);
      }, 200);

    lista = false;
    producto = false;
  });
}

function EventoEliminarLista(itemLista){
  $("#eliminar").click(function(e){
      getearSessionId().then(id => {
        var listaServidor = {            
          nombre: itemLista,
          sessionId: id
        }

        var request = $.ajax({
          type: "POST",
          url: "http://localhost:3000/bajaLista",
          data: listaServidor
        });
        request.done(function(response) {
          console.log(response);
          obtenerSessionIdABM(response.sessionId);
        });
      });

      chrome.storage.sync.remove(itemLista);

       setTimeout(function (){
        DesplegarListas();
        EventoListas();
      }, 200);
  });
}

function EventoOcultarMenu(){
  $(window).click(function() {
    lista = false;
    producto = false;
    producto = false;
  $("#menu").hide();
    });
}

function EventoFondo(){
  $("#eliminar").mouseover(function(){
    $("#eliminar").css("background-color", "#757575");
    $("#cambiarNombreLista").css("background-color", "#ffffff");
  });
  $("#cambiarNombreLista").mouseover(function(){
    $("#eliminar").css("background-color", "#ffffff");
    $("#cambiarNombreLista").css("background-color", "#757575");
  });
  $(".contextMenu").mouseleave(function(){
    $("#eliminar").css("background-color", "#ffffff");
    $("#cambiarNombreLista").css("background-color", "#ffffff");
  });
}