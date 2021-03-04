//se encarga e las funciones de renderizar y modificar el html
//se lo exporta antes del socket chat porque el viejo requiere modulos de este jquery


var params = new URLSearchParams(window.location.search);
//haceos referecnias a los params para obetener el nombre y la sala del usuario
var nombre = params.get('nombre');
var sala= params.get('sala');

//de esta manera acceso a lad referencias  de ID del HTML con jQuery;
//referencia e jquery
var divUsuarios= $('#divUsuarios');

//creamos una referencia para capturar el form del texto a enviar al chat desde html 
var formEnviar=$('#formEnviar')

//referencia del input desde el html del chat para capturar el texto escrito
var txtMensaje=$('#txtMensaje')

//referencia al chatbox para visualizar los msj que se envian
var divChatbox=$('#divChatbox')




//funciones para renderizar  usuarios
function renderizarUsuarios(personas){//recibe un arreglo de personas o se usuarios conectados



    console.log(personas);

    var html = "";

    //DE ESTA FORMA APRARECERA CADA VEZ QUE SE INICIE UN SUSARIO EN EL HTML


    html+='<li>';
    html+='<a href="javascript:void(0)" class="active"> Chat de <span>'+params.get('sala')+'</span></a>';
    html+='</li>';


    //recorro con un for para asignar los datos a cada usuario nuevo
    for(var i=0;i<personas.length;i++){

        html+='<li>';
        html+='<a  data-id="'+ personas[i].id +'"   href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ personas[i].nombre +'<small class="text-success">online</small></span></a>';
        html+='</li>';

    }

    
    divUsuarios.html(html);
    //este script se ejecuta en el socket chat en la parte que se emite la conexion


}

//funcion que muestra en el row los mensajes enviados por los chats
function renderizarMensajes(mensaje,yo){
var html =''
    var fecha= new Date(mensaje.fecha)
    var hora =  fecha.getHours()+':'+ fecha.getMinutes();

    var adminClass = 'info'

    if(mensaje.nombre==='Administrador'){
        adminClass='danger'
    }


    if(yo){

        html += '    <li class="reverse">'
        html += '            <div class="chat-content">'
        html += '                <h5>'+ mensaje.nombre+'</h5>'
        html += '               <div class="box bg-light-inverse">'+mensaje.mensaje+'</div>'
        html += '             </div>'
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '         <div class="chat-time">'+hora+'</div>'
        html += '    </li>'


    }else{

        
        html += '<li class="animated fadeIn">'

        if(mensaje.nombre !== 'Administrador'){

            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
            
        }
        html += '    <div class="chat-content">'
        html += '       <h5>'+ mensaje.nombre+'</h5>'
        html += '        <div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div>'
        html += '  </div>'
        html += '  <div class="chat-time">'+hora+'</div>'
        html += '</li>'
        
    }





    divChatbox.append(html);

    scrollBottom();


}

//logica para qeu el scroll siempre se mantenga en la parte de abajo , es decir , ver los ultimos msj en el n=boxChat

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}



//listeners : Escuchas y acciones de los eventos desde el html con jquery
//de esta manera le decimo a jquery que este pendiente de cada click en cada <a>
divUsuarios.on('click','a',function (){

    //sintaxis esoepcial de jqyery que hace referencia al <a> o cualquier elemento que hagamos click
    //el id de data(id ) es el nombre que se le da en la inserccion del HTML en el for, en "data-id=      "
    var id = $(this).data('id')

    //para validar el click es siple
    //si existe el id hago lo que tengo que hacer , sino ,caso contrario no hace nada
    if(id){
        console.log(id);
    }


})


//cuando jquery recibe un submit captura el evento con la e
formEnviar.on('submit', function(e){
    
    e.preventDefault();
    //para usar el msj tengo que agregar la referencia al input del chat
    //console.log(txtMensaje.val());


    //val captura el valor., y trim elimina los espacios al principio y el final
    if(txtMensaje.val().trim().length ===0){
        return
    }


    socket.emit('crearMensaje',{
        nombre: nombre,
        mensaje: txtMensaje.val()
    },function(mensaje){
        //volves a vacio el txt luego de emnviarlos
        txtMensaje.val('').focus();
        //envia msj al html , este hace referencia al msj que envia el cliente 
        //en socket-chat elq ue recibe de otro cliente
        renderizarMensajes(mensaje,true);
        //scrollBottom()
    })

})


