class Usuario{
    //creo un arreglo de usuarios para controlar las perosnas que se encuentarn activas en las salas
    constructor(){
        //arrrelo de personas activas
        this.personas=[];

    }    


    //agrega una perosna que se une al chat

    agregarPersona(id,nombre,sala){
    //datos que contienen los usuarios
        let persona ={id,nombre,sala}

        this.personas.push(persona);
        return this.personas;
        
    }

    //busca a una perosna dentro de las personas dentro del arreglo de usuarios
    //filter filtra una propiedad y devuelve otro array
    //el [0] es para que solo devuelva un unico registro siempre
    getPersona(id){
       /*  let persona = this.personas.filter( persona=>{
            return persona.id = id;
        })[0] */
        //resumido
        let persona = this.personas.filter(persona=> persona.id === id)[0];
        //si encuentra algo devuleve una perosna , sino un undefine o un NULL
        return persona; 
    }
//devuelve todas las personas que se encuentran en el array
    getPersonas(){
        return this.personas;
    }


    getPersonasPorSala(sala){
        let personasEnSala= this.personas.filter(persona =>{
            return persona.sala ===sala
        });
         return personasEnSala;
    }


    borrarPersona(id){
        //para no perder la relacion se realiza las operaciones con ese usuario antes de sacarlo del array
        let personaBorrada=this.getPersona(id);

        //filter devuelve un nuevo array exceptuando al Id QUE QUEREMOS eliminar y lo reasignamos al array original
        //es el negativo de getPersonas
        this.personas = this.personas.filter(persona=> persona.id !== id)

        return personaBorrada;
    }






}



module.exports ={Usuario}