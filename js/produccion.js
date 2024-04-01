export default class Produccion{

    constructor(noTerminales, inicial, producciones){
        this._inicial = inicial;
        this._noTerminales = noTerminales;
        this.produccionesNuevas = []
        this._producciones = [...producciones];
    }

    // Metodo que me retorna true o false si la palabra ingresada cumple con la gramatica
    validarPalabra(palabra, producciones){
       
        //obtener producciones iniciales
        let produccionesIniciales = producciones.filter(produccion => produccion[0] === this._inicial)
        let cumple = false

        //buscar producciones que sean terminales y comparar con la palabra
        produccionesIniciales.forEach(produccion => {
        
            let produccionesActuales = produccion[1]
            let separadas = produccionesActuales.split(' ')
            console.log(separadas)

            if(separadas.length === 1){
                let terminales = separadas.find(separada => !this._noTerminales.includes(separada))
                if (palabra === terminales){
                    console.log(palabra, terminales, palabra === terminales)
                    cumple = true
                }
            } else {
                let terminales = separadas.filter(separada => !this._noTerminales.includes(separada))
                if(terminales.length === palabra.split(' ').length){
                    if(palabra === terminales.join(' ')) {
                        cumple = true
                    }
                }
            }

            //si la produccion es un no terminal que tiene por lo menos una produccion que tenga uno o más terminales (sin no terminales) y la palabra es igual a esa produccion entonces cumple
            if(separadas.length === 1) {
                let terminales = separadas.find(separada => this._noTerminales.includes(separada))
                //voy a buscar la produccion que tenga ese no terminal
                let produccionNoTerminal = producciones.find(produccion => produccion[0] === terminales)
                console.log(produccionNoTerminal)
                if(produccionNoTerminal) {
                    const verificar = produccionNoTerminal[1].split(' ')
                    if(palabra.split(' ').length === verificar.length){
                        if(palabra === verificar.join(' ')){
                            cumple = true
                        }
                    }
                }
            }

        })

        return cumple
    }

    //tiene recursion izquierda
    tieneRecursionIzquierda(){
        let tieneRecursion = false
        this._producciones.forEach(produccion => {
            let separadas = produccion[1].split(' ')
            if(separadas[0] === produccion[0]){
                tieneRecursion = true
            }
        })
        return tieneRecursion
    }

    //      [opsuma term], 1, [expresion], producciones
    validar(palabra, index, elementoActual, produccionesRestantes) {
        console.log('validando')
        let produccionesIniciales = this._producciones.filter(produccion => produccion[0] === this._inicial)
        
        if(!elementoActual && !produccionesRestantes) {
            //* Tomo la primera produccion
            let produccionActual = produccionesIniciales[0]
            //* Separo la produccion
            let separadas = produccionActual[1].split(' ')
            //* Tomo el primer elemento
            let elementoActual = separadas[0]
            //* Tomo el resto de la produccion
            let produccionesRestantes = separadas.slice(1)
            console.log({
                produccionActual,
                elementoActual,
                produccionesRestantes
            })

            //* El elemento actual NO es un terminal
            if(this._noTerminales.includes(elementoActual)) {
                //* verifico si la palabra en el indice actual es igual al elemento actual
            }
        }
    }

    EliminarRecursion() {
        //*Guarda en una variable el no terminal que vamos a analizar al ser el primero se guarda el inicial
        let noTerminalActual = this._inicial;
        //* Se inicializan las variables que vamos a usar.
        let produccionNueva = [];
        let mismoNoTerminal = false;
        let produccionVacio =[];

        for (let i = 0; i < this._producciones.length; i++){
            let produccion = this._producciones[i];
            let nuevaProduccion = [];
            //* Divide la cadena por caracteres y los guarda en un arreglo 
            let aux = produccion[1].split(" ");
            
            //* Comprueba si el terminal que estamos revisando cambió
            if (noTerminalActual != produccion[0]){
                if (mismoNoTerminal){
                    //* Se le agrega los no terminales la producción con λ, que se le agrega al final
                    //* de todas las casos que se elimina la recusión por la izquierda 
                    produccionVacio.push("λ");
                    produccionNueva.push(produccionVacio);
                    produccionVacio =[];
                } 
                
                //*Se actualiza la variable noTerminalActual con el nuevo no terminal 
                noTerminalActual = produccion[0];
                //*Se especifica que ya no estamos evaluando el mismo no terminal con false en la otra variable 
                mismoNoTerminal = false;
            }

            //* Valida si hay recursion por la izquierda
            if (aux[0] == produccion[0]){

                //* Valida si no se habia agregado previamente la nueva producción para el λ
                if(mismoNoTerminal == false){
                    produccionVacio.push((produccion[0]+"'"));
                }

                //* Cambia que estamos en un terminal y agrega la nueva produccion "prima"
                mismoNoTerminal = true;
                nuevaProduccion.push((produccion[0]+"'"));
                
                //* Crea la producción
                let strProduc = ""; 
                for (let j = 0; j < aux.length; j++){
                    //* Omite la primera ya que esta genera la recursión
                    if (j == 0){
                        strProduc = aux[j+1];
                    }else{ 
                        //* En la ultima posición se agrega la nueva produccion "prima"
                        if (j == aux.length -1){
                            strProduc = strProduc+" "+produccion[0]+"'";
                        }else{
                            strProduc = strProduc+" "+aux[j+1];
                        }
                    }
                }

                //* Se agrega al nuevo arreglo la produccion modificada   
                nuevaProduccion.push(strProduc);
                //* Se agrega a la nueva lista de producciones la cual se va retornar 
                produccionNueva.push(nuevaProduccion);
            }else{
                //* Valida si previamente hubó recursion por izquierda en este No Terminal
                if (mismoNoTerminal == true){
                    let indice = this._producciones.indexOf(produccion);
                    let str = produccion[1]+" "+produccion[0]+"'";
                    this._producciones[indice][1] = str;

                    if (produccion[0] == this._inicial){
                        produccionNueva.unshift(this._producciones[indice]);
                    }else{
                        produccionNueva.push(this._producciones[indice]);
                    }
                }else{
                    //* Si no hay recursion por la izquierda guarda la producion tal como estaba en 
                    //* la nueva lista de producciones
                    produccionNueva.push(produccion);
                }
            }
                
            
        }
        //* Valida si la despues de recorrer todo el arreglo la ultima produccion que revisó no le  
        //* haya faltado la producción vacia su hubo recursión por izquierda
        if (mismoNoTerminal == true){
            produccionVacio.push("λ");
            produccionNueva.push(produccionVacio);
            produccionVacio =[]; 
        } 

        return produccionNueva;
    }
}
