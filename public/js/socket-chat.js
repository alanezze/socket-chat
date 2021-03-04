//////===========================FRONT END DEL CLIENTE===========================================


var socket = io();

//configuracion para perosnalizar el envio de datos porparametrs URL
var params= new URLSearchParams(window.location.search);
//preguntamos si viene el nombre en la URL  y si es necesario una sala
if (!params.has('nombre')|| !params.has('sala')){
    //redirecciona a una pagina especifica de la app
    window.location='index.html'
    //lanza un error
    throw new Error('el nombre y sala son  necesario')
}
//construllo el nombre a travez de params y para enviarlos envio la sala si es necesario
var usuario={
    nombre: params.get('nombre'),
    sala:params.get('sala')
}



socket.on('connect', function() {
    console.log('Conectado al servidor');
    //si logra conectarse la respuesta del servidor envia la lista completa de los usuarios conectados
    socket.emit('entrarChat',usuario,function (resp){
        //para responder el colback se configura desde socket.js desde el backend
        console.log('usuarios conectados',resp);
    })
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


socket.on('crearMensaje',function(mensaje){
    console.log('Servidor',mensaje);
})



///ESCUCHAR CAMBIOS DE USUARIOS
//CUANDO UN SUSUARIO ENTRA O SALE DEL CHAT
socket.on('listaPersona',function(personas){
    console.log(personas);
})


//mensajes privados : accion que se dispara con este evento
//escucha cuando es un mensaje privado desde cada cliente, y tambien hay que hacerlo desde el servidor

socket.on('mensajePrivado',function(mensaje){

    console.log('mensaje privado :',mensaje);
})


/* 
==================BASICO===============================================================
// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('enviarMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

}); */