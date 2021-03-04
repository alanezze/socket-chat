////-======================ESTE ES EL BACKEND DEL SERVIDOR==================================



const { io } = require('../server');

//confuguracion para que el bakcend responda el callback de la conexion y devuelva la lsita de conectados
const {Usuario} = require('../classes/usuario')



const {crearMensaje} = require('../sockets/utilidades/utilidades');

const usuarios= new Usuario();




io.on('connection', (client) => {
 
    client.on('entrarChat',(data,callback)=>{


        console.log(data);


        //verifico que exista el nombre y lo valido, sino repsondo el callback "function(resp){     }"
        
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje:"el nombre y la sala son necesarios"
            })
        }

        //PARA CONECTANOS  a una sala utilizamos el join que utiliza tu mismo ID
        client.join(`${data.sala}`)



        
        //si existe el nombre lo mandamos a la lista de usuarios
        //cuando creamos unas salas tambien tienen que ser aprte de los datos qu econtienen los usuarios
        ///let personas= usuarios.agregarPersona(client.id,data.nombre,data.sala);

        usuarios.agregarPersona(client.id,data.nombre,data.sala);





        //envia msj a todos los uduarios conectados al array
        //client.broadcast.emit('listaPersona',usuarios.getPersonas())

        //encia solo a las salas con el id correspondiente
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasPorSala(data.sala))



  //ADMIN ENVIA UN MSJ DICIENDO QUIEN SE UNIO
        client.broadcast.to(data.sala).emit('crearMensaje',crearMensaje('Administrador',`${data.nombre} se unio a la sala`))

        
        callback(usuarios.getPersonasPorSala(data.sala));



               
      
    })


    ///con este metodo compartimos a todos los usuarios cuando alguien llame a la funcion crearMensaje para mostrar a todos que se desconecto

    //creando una nueva variable podemos capturar todos los datos del cliente con client.id
    client.on('crearMensaje',(data,callback)=>{

        //captura de los datos del cliente
        let persona= usuarios.getPersona(client.id);

        //podemos ponet data.nombre que es lo que recibo siempre o los datos del cliente con client.id.nombre
        let mensaje = crearMensaje(persona.nombre,data.mensaje);//al tener esto se obvia que solo se envia el mensaje en el emit

        ///utilizamos broadcast para mandar a todos los usuarios el evento crear mensaje con el msj que acabamos de crear
        //client.broadcast.emit('crearMensaje',mensaje)


        //este es para privados
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje )
 

    
        callback(mensaje);
    
    
    
    })


     client.on('disconnect',()=>{

        console.log(client.id);
        let personaBorrada= usuarios.borrarPersona(client.id);
        console.log(personaBorrada);
/* 
        client.broadcast.emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} salio de la sala`))

        client.broadcast.emit('listaPersonas', usuarios.getPersonas()) */

        
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} salio de la sala`))

        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala
            ))
           
    })
 
 
    ///esto es lo que hara el servidor cuando alguien quiere mandar un MP a otra persona
    //el seridor escuha los mp y recibe la data,
    client.on('mensajePrivado',data=>{
        //data tiene que contener un ID y hay que validarlo
        //tambien hayq ue validar que el msj venga desde la data
        //todo lo que ocupemos desde la data debemos asegurarnos de que llegue
        let persona= usuarios.getPersona(client.id);
        //broadcast emitimos a todos los usuarios conectados, y emitimos el evento mensajePrivado
        client.broadcast.to(data.para).emit('mensajePrivado',crearMensaje(persona.nombre,data.mensaje));



    })
 
 
 
 
 /*//////- CONFIGURACION INICIAAAL  ////////////////////////////////////////////////////////////////////////////////////////////////////////
    console.log('Usuario conectado');

    client.emit('enviarMensaje', {
        usuario: 'Administrador',
        mensaje: 'Bienvenido a esta aplicación'
    });



    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
    
     // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {

        console.log(data);

        client.broadcast.emit('enviarMensaje', data);


        // if (mensaje.usuario) {
        //     callback({
        //         resp: 'TODO SALIO BIEN!'
        //     });

        // } else {
        //     callback({
        //         resp: 'TODO SALIO MAL!!!!!!!!'
        //     });
        // }



    }); */

});