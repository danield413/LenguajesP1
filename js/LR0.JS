export default class LR0 {

    constructor(noTerminales, inicial, producciones) {
        this._noTerminales = noTerminales
        this._inicial = inicial
        this._producciones = producciones
        this._terminales = [];
    }

    /**
     * @param {*} produccionesActuales producciones para evaluar 
     * @param {*} iteracionesEvaluadas producciones que ya se han evaluado
     * @param {*} estadosR Lista la cual contiene las R o estado final de la producción 
     * @returns Lista la cual contiene las R o estado final de la producción 
     *          con la iteración en la que se encuentra
    */
    analizar(produccionesActuales, iteracionesEvaluadas, estadosR) {
        //* Guarda la lista de producciones en la lista de iteraciones
        iteracionesEvaluadas.push(produccionesActuales);
        
        //* Lista de caracteres buscados para evitar repetidos
        let listaDeCaracteresBuscados = new Set();
    
        //* Recorre las producciones actuales
        for (let produccion of produccionesActuales) {
            let [nombre, cuerpo] = produccion;
            //* ejemplo: NOMBRE -> CUERPO
            for (let j = 0; j < cuerpo.length; j++) {
                //* Si encuentra un punto al final de la producción, agrega el R respectivo
                if (cuerpo[j] === "." && j === cuerpo.length - 1) {
                    let indicePosicionProduccion = this.obtenerInidiceProduccion(produccion);
                    estadosR.push([`R-${indicePosicionProduccion}`, iteracionesEvaluadas.length - 1]);
                }
                //* Si encuentra un punto que no está al final y el siguiente caracter no se ha buscado anteriormente
                if (cuerpo[j] === "." && j !== cuerpo.length - 1 && !listaDeCaracteresBuscados.has(cuerpo[j + 1])) {
                    //* Agrega el caracter a la lista de caracteres buscados
                    listaDeCaracteresBuscados.add(cuerpo[j + 1]);
                    let listaProduccionCumplen = [];
    
                    //* Busca otras producciones que tengan el mismo caracter después del punto
                    for (let otraProduccion of produccionesActuales) {
                        let [otroNombre, otroCuerpo] = otraProduccion;
    
                        for (let y = 0; y < otroCuerpo.length; y++) {
                            if (otroCuerpo[y] === "." && otroCuerpo[y + 1] === cuerpo[j + 1]) {
                                //* Crea una nueva producción con el punto movido
                                let produccionModif = [
                                    ...otroCuerpo.slice(0, y),
                                    ...otroCuerpo.slice(y + 1, y + 2),
                                    ".",
                                    ...otroCuerpo.slice(y + 2)
                                ];
    
                                listaProduccionCumplen.push([otroNombre, produccionModif]);
                            }
                        }
                    }
    
                    //* Actualiza los elementos de listaProduccionCumplen
                    listaProduccionCumplen = this.actualizarProducciones(listaProduccionCumplen);
    
                    //* Si la lista de producciones no se ha iterado antes, realiza un llamado recursivo
                    if (this.produccionRecorrida(listaProduccionCumplen, iteracionesEvaluadas)) {
                        this.analizar(listaProduccionCumplen, iteracionesEvaluadas, estadosR);
                    }
                }
            }
        }
    
        //* Retorna estadosR, que contiene los estados finales de la producción con la iteración en la que se encuentran.
        return estadosR;
    }
    
    //* Retorna si el caracter se encuentra en la lista o no
    esCaracterRepetido(lista, caracter) {
        return !lista.includes(caracter);
    }

    //* Actualiza las producciones en una iteración
    actualizarProducciones(listaProduccionCumplen) {
        let nuevaLista = [...listaProduccionCumplen]
        for (let i = 0; i < listaProduccionCumplen.length; i++) {

            for (let j = 0; j < listaProduccionCumplen[i][1].length; j++) {
                if (listaProduccionCumplen[i][1][j] == ".") {
                    if (this.esNoTerminal(listaProduccionCumplen[i][1][j + 1])) {
                        for (let x = 0; x < this._producciones.length; x++) {
                            if (this._producciones[x][0] == listaProduccionCumplen[i][1][j + 1]) {
                                if (this.validarRepetidos(nuevaLista, this._producciones[x])) {
                                    nuevaLista.push(this._producciones[x])
                                }
                            }
                        }
                    }
                }
            }
        }

        if (nuevaLista.length > listaProduccionCumplen.length) {
            nuevaLista = [...this.actualizarProducciones(nuevaLista)]
        }

        return nuevaLista;
    }

    //* Retorna si el caracter es un no terminal
    esNoTerminal(caracter) {

        let validador = false;
        for (let i = 0; i < this._noTerminales.length; i++) {
            if (this._noTerminales[i] == caracter) {
                validador = true;
            }
        }

        return validador;
    }

    //* Retorna si la producción ya se encuentra en la lista
    validarRepetidos(lista, produccion) {

        let validador = true;
        for (let i = 0; i < lista.length; i++) {
            if (lista[i] == produccion) {
                validador = false;
            }
        }

        return validador;
    }

    //* Retorna si la producción ya ha sido recorrida
    produccionRecorrida(lista, listaIteraciones) {
        return !listaIteraciones.some(iteracion => 
            JSON.stringify(iteracion) === JSON.stringify(lista)
        );
    }
    
    //* Retorna el índice de la producción
    obtenerInidiceProduccion(produccion) {
        const produccionPuntoAlInicio = [
            produccion[0],
            ["."].concat(produccion[1].slice(0, -1))
        ];
    
        return this._producciones.findIndex(
            prod => JSON.stringify(prod) === JSON.stringify(produccionPuntoAlInicio)
        );
    }
    
    //* Retorna los caracteres que son terminales
    buscarTerminales(producciones) {
        let terminales = new Set();
    
        for (let produccion of producciones) {
            for (let simbolo of produccion[1]) {
                if (!this._noTerminales.includes(simbolo) && simbolo !== ".") {
                    terminales.add(simbolo);
                }
            }
        }
    
        return Array.from(terminales);
    }
    
    //* Retorna si 2 arreglos son iguales
    equals(array1, array2) {
        if (array1.length !== array2.length) return false;
    
        for (let i = 0; i < array1.length; i++) {
            if (Array.isArray(array1[i]) && Array.isArray(array2[i])) {
                if (!this.equals(array1[i], array2[i])) return false;
            } else if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }

    //* Crea los estados del autómata
    mostrar(estadosR, iteraciones) {

        let text = '';
        let contador = 0

        for (let i = 0; i < iteraciones.length; i++) {

            for (let j = 0; j < iteraciones[i].length; j++) {
                // si la iteracion termina con un . 
                let aux = ''
                aux += iteraciones[i][j][0] 
                aux += " -> "

                iteraciones[i][j][1].forEach((i) => {
                    aux += i
                })
                
                //si entra acá es un R
                if( aux.slice(-1) === "." && iteraciones[i].length === 1) {
                    contador++
                }
            }

            text += "<div class='estado text-center'>";
            text += "<div><h2 class='bg-dark text-white' >Estado: " + i + "</h2> </div";
            text += "<div>"
            for (let j = 0; j < iteraciones[i].length; j++) {
                

                //* si la iteracion termina con un . 
                let aux = ''
                aux += iteraciones[i][j][0] 
                aux += " → ";
               
                iteraciones[i][j][1].forEach((i) => {
                    aux += i
                })
                //si el ultimo caracter es un .
                if( aux.slice(-1) === "." ) {
                    console.log(aux.slice(-1));
                    text += "<p class='erre flex align-items-center rounded fw-bold prod'>";
                } else {
                    text += "<p class='text-white prod'>";
                }
                
                text += aux
                text += "</p>";
            }
            text += "</div> </div>";
        }

        if(contador === this._producciones.length) {
            Swal.fire({
                icon: "success",
                title: "ES SLR(0)",
                showConfirmButton: false,
              });
        } else {
            Swal.fire({
                icon: "success",
                title: "ES LR(0)",
                showConfirmButton: false,
              });
        }

        return text;

    }
}