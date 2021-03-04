


////================= asi se crean y se exportan funciones, esta exportada y requerida en socket del server=============================



const crearMensaje=(nombre, mensaje)=>{

    return {nombre,mensaje,fecha: new Date().getTime()}

}


module.exports={crearMensaje}