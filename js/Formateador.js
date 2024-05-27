export default class Formateador{

    formatearProducciones(noTerminales, inicial, producciones){
        let produccionNueva = [];
        let nuevaProduccion = [];

        nuevaProduccion.push("S");

        let produccion = [];
        produccion.push(".");
        let aux = producciones[0][1].split(" ");

        produccion.push(aux[0]);

        nuevaProduccion.push(produccion);
        
        produccionNueva.push(nuevaProduccion);

        for (let i = 0; i < producciones.length; i++){
            let produccion = producciones[i];
            let nuevaProduccion = [];
            
            // Divide la cadena por caracteres y los guarda en un arreglo 
            let aux = produccion[1].split(" ");
            aux.unshift("."); // Agrgar de primero en la produccion

            nuevaProduccion.push(produccion[0]);
            nuevaProduccion.push(aux);

            produccionNueva.push(nuevaProduccion);

        }

        //console.log(produccionNueva);
        return produccionNueva;
    }
}