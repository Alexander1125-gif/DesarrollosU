// Archivo principal de JavaScript de ECOCANJE.
// Importa las funciones de cada módulo e inicia las interacciones de la página.
import { inicializarReciclaje } from './reciclaje.js';
import { inicializarPremios } from './premios.js';

const iniciarAplicacion = () => {
    inicializarReciclaje();
    inicializarPremios();
};

document.addEventListener('DOMContentLoaded', iniciarAplicacion);
