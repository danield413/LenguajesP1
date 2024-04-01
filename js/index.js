import Produccion from './produccion.js';

let producciones = [];
let noTerminales = []; 
let inicial = "exp";

let listaNoTerminales = [];
let listProducciones = [];

document.addEventListener('DOMContentLoaded', async () => {
    
    document.querySelector('#eliminarRecursion').addEventListener('click',eliminarRecursion);

    document.querySelector('#guardarGramatica').addEventListener('click',guardarGramatica);
    document.querySelector('#cancelarGramatica').addEventListener('click',cancelarGramatica);
    
    document.querySelector('#probarPalabra').addEventListener('click', probarPalabra)

    document.querySelector('#leerjson').addEventListener('click', async () => {

        cancelarGramatica();

        //* genera un numero aleatorio entre 1 y 5
        const random = Math.floor(Math.random() * 5) + 1;

        const response = await fetch(`/gramatica${random}.json`);
        const json = await response.json();
        listaNoTerminales = json.noTerminales;
        listProducciones = json.producciones;
        inicial = json.inicial;

        // console.log({
        //     listaNoTerminales,
        //     listProducciones,
        //     inicial
        // })

        listProducciones.forEach(produccion => {
            var text = document.createTextNode(" " + produccion[0]+" → "+produccion[1]);
            const p = document.createElement('p');
            p.classList.add('m-0');
            p.classList.add('text-dark');
            p.classList.add('text-center');
            p.classList.add('bg-warning');
            p.classList.add('mb-2');
            p.classList.add('p-2');
            p.classList.add('rounded');
            p.classList.add('animate__animated');
            p.classList.add('animate__bounceIn');
            p.appendChild(text);

            document.getElementById('gramaticaGuardada').appendChild(p);
        });
        
        // let x = new Produccion(listaNoTerminales, inicial, listProducciones);

        // producciones =[...x.EliminarRecursion()]

        // actualizarNoTerminales();

        // document.querySelector('#Resultado').innerHTML = "";

        // let txtMuestra = ""
        // for (let i = 0; i < producciones.length; i++) {

        //     for (let j = 0; j < producciones[i].length; j++) {
        //         if(j == 0){
        //             txtMuestra += producciones[i][j]+" → "
        //         }else{
        //             txtMuestra += producciones[i][j]
        //             txtMuestra += "<br>";
        //         }
        //     }
        // }

        // if (txtMuestra == ""){
        //     txtMuestra = "No se han ingresado producciones";
        // }

        // document.querySelector('#Resultado').innerHTML = txtMuestra;
       
    })
})

const probarPalabra = () => {
    const text = document.querySelector('#palabra').value;

    if (text == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha ingresado una palabra',
          
        })
        return;
    }

    if (listaNoTerminales.length == 0){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha ingresado una gramatica',
          
        })
        return;
    }

    let prod = new Produccion(listaNoTerminales, inicial, listProducciones);

    //* VALIDACIÓN
    const resp = prod.validarPalabra(text, listProducciones);
    
    console.log(resp)
    if(resp){
        Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: 'La palabra cumple con la gramatica',
          
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'La palabra no cumple con la gramatica',
          
        })
    }
}

function guardarGramatica(){
    var noTerminalForm = document.getElementById('noTerminal').value;
    var produccionForm = document.getElementById('produccion').value;

    if(noTerminalForm == "" || produccionForm == ""){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha ingresado un no terminal o una producción',
          
        })
        return;
    }
    
    let ListNoTerminalProduccion=[];
    ListNoTerminalProduccion.push(noTerminalForm);
    ListNoTerminalProduccion.push(produccionForm);

    
    document.getElementById("formGramatica").reset();
    
    listaNoTerminales.push(noTerminalForm);
    listProducciones.push(ListNoTerminalProduccion);

    var text = document.createTextNode(" " + noTerminalForm+" → "+produccionForm);
    const p = document.createElement('p');
    p.classList.add('m-0');
    p.classList.add('m-0');
    p.classList.add('text-dark');
    p.classList.add('text-center');
    p.classList.add('bg-warning');
    p.classList.add('mb-2');
    p.classList.add('p-2');
    p.classList.add('rounded');
    p.classList.add('animate__animated');
    p.classList.add('animate__backInRight');
    p.appendChild(text);

    document.getElementById('gramaticaGuardada').appendChild(p);
    
}
function cancelarGramatica(){
    listaNoTerminales = [];
    listProducciones = [];
    document.getElementById('gramaticaGuardada').innerHTML ="";
    document.getElementById('Resultado').innerHTML ="";
}


function eliminarRecursion(e){
    console.log(listProducciones)
    if (listaNoTerminales.length == 0){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha ingresado una gramatica',
          
        })
        return;
    }

    // if(listProducciones.length > 0){
    //     //borrarlas
    //     Swal.fire({
    //         icon: 'error',
    //         title: 'Oops...',
    //         text: 'Ya se ha eliminado la recursión por la izquierda',
    //     })  
    //     return;
    // }

    let prod = new Produccion(listaNoTerminales, inicial, listProducciones);

    if(prod.tieneRecursionIzquierda()) {
        Swal.fire({
            icon: 'info',
            title: 'Procedimiento!',
            text: 'La gramatica tiene recursión izquierda, se procederá a eliminarla ✅',
          
        })
        producciones =[...prod.EliminarRecursion()]

        actualizarNoTerminales();

        document.querySelector('#Resultado').innerHTML = "";
        console.log(producciones)
        let txtMuestra = ""
        for (let i = 0; i < producciones.length; i++) {

            for (let j = 0; j < producciones[i].length; j++) {
                if(j == 0){
                    txtMuestra += producciones[i][j]+" → "
                }else{
                    txtMuestra += producciones[i][j]
                    txtMuestra += "<br>";
                }
            }
        }

        if (txtMuestra == ""){
            txtMuestra = "No se han ingresado producciones";
        }

        // document.querySelector('#Resultado').innerHTML = txtMuestra;

        producciones.forEach(produccion => {
            let text = document.createTextNode(" " + produccion[0]+" → "+produccion[1]);
            const p = document.createElement('p');
            p.classList.add('w-100');
            p.classList.add('m-0');
            p.classList.add('text-dark');
            p.classList.add('text-center');
            p.classList.add('bg-warning');
            p.classList.add('mb-2');
            p.classList.add('p-2');
            p.classList.add('rounded');
            p.classList.add('animate__animated');
            p.classList.add('animate__bounceIn');
            p.appendChild(text);
    
            document.getElementById('Resultado').appendChild(p);
        })

        
    
    } else {
        Swal.fire({
            icon: 'info',
            title: 'Procedimiento!',
            text: 'La gramatica no tiene recursión izquierda, no se puede eliminar 😓',
          
        })
    }


    
}

function actualizarNoTerminales(){
    for (let i = 0; i < producciones.length; i++){
        let produccion = producciones[i];
        //Cada no terminal que encuentre y que no este en la lista lo agrega
        if(!(noTerminales.includes(produccion[0]))){
            noTerminales.push(produccion[0])
        }
    }
}
