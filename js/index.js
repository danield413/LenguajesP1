import LR0 from './LR0.JS'
import Formateador from './Formateador.js'

let inicial = "E";
let listaNoTerminales = [];
let listProducciones = [];
let iteraciones = [];

document.addEventListener('DOMContentLoaded', async () => {

    document.querySelector('#guardarGramatica').addEventListener('click', guardarGramatica);
    document.querySelector('#cancelarGramatica').addEventListener('click', cancelarGramatica);

    document.querySelector('#analizar').addEventListener('click', () => {

        let formateador = new Formateador();

        let prods = formateador.formatearProducciones(
            listaNoTerminales,
            inicial,
            listProducciones
        );

        let anLR = new LR0(listaNoTerminales, inicial, prods);
        let rn = [...anLR.analizar(prods, iteraciones, [])];

        console.log("rn", rn);
        console.log("iteraciones", iteraciones);

        document.querySelector('#resultado').innerHTML = anLR.mostrar(rn, iteraciones);
    });

    document.querySelector('#leerjson').addEventListener('click', async () => {

        cancelarGramatica();

        const response = await fetch(`/gramatica1.json`);
        const json = await response.json();
        listaNoTerminales = json.noTerminales;
        listProducciones = json.producciones;
        inicial = json.inicial;

        listProducciones.forEach(produccion => {
            var text = document.createTextNode(" " + produccion[0] + " → " + produccion[1]);
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

    })
})

function guardarGramatica() {
    var noTerminalForm = document.getElementById('noTerminal').value;
    var produccionForm = document.getElementById('produccion').value;

    if (noTerminalForm == "" || produccionForm == "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha ingresado un no terminal o una producción',

        })
        return;
    }

    let ListNoTerminalProduccion = [];
    ListNoTerminalProduccion.push(noTerminalForm);
    ListNoTerminalProduccion.push(produccionForm);


    document.getElementById("formGramatica").reset();

    listaNoTerminales.push(noTerminalForm);
    listProducciones.push(ListNoTerminalProduccion);

    var text = document.createTextNode(" " + noTerminalForm + " → " + produccionForm);
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

function cancelarGramatica() {
    listaNoTerminales = [];
    listProducciones = [];
    document.getElementById('gramaticaGuardada').innerHTML = "";
}