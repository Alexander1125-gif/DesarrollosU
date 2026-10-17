// Funciones relacionadas con el registro de materiales reciclables.
export const inicializarReciclaje = () => {
    const materialSeleccionado = document.querySelector('#material');
    const cantidadMaterial = document.querySelector('#cantidad');
    const centroSeleccionado = document.querySelector('#centro');
    const fotoReciclaje = document.querySelector('#foto-reciclaje');
    const puntosEstimados = document.querySelector('#puntos-estimados');
    const formularioReciclaje = document.querySelector('#form-reciclaje');
    const mensajeRegistro = document.querySelector('#mensaje-registro');
    const listaEntregas = document.querySelector('#lista-entregas');
    const contenedorVistaPrevia = document.querySelector('#contenedor-vista-previa');
    const vistaPreviaFoto = document.querySelector('#vista-previa-foto');

    let imagenSeleccionada = '';

    const calcularPuntos = () => {
        const valorMaterial = Number(materialSeleccionado.value);
        const cantidad = Number(cantidadMaterial.value);

        if (!valorMaterial || !cantidad) {
            puntosEstimados.textContent = '0 pts';
            return 0;
        }

        const puntosCalculados = Math.round(valorMaterial * cantidad);
        puntosEstimados.textContent = `${puntosCalculados} pts`;
        return puntosCalculados;
    };

    const mostrarVistaPrevia = () => {
        const archivo = fotoReciclaje.files[0];

        if (!archivo) {
            imagenSeleccionada = '';
            contenedorVistaPrevia.hidden = true;
            vistaPreviaFoto.removeAttribute('src');
            return;
        }

        if (!archivo.type.startsWith('image/')) {
            mensajeRegistro.textContent = 'Selecciona un archivo de imagen válido.';
            fotoReciclaje.value = '';
            imagenSeleccionada = '';
            contenedorVistaPrevia.hidden = true;
            return;
        }

        const lectorImagen = new FileReader();

        lectorImagen.addEventListener('load', () => {
            imagenSeleccionada = lectorImagen.result;
            vistaPreviaFoto.src = imagenSeleccionada;
            contenedorVistaPrevia.hidden = false;
            mensajeRegistro.textContent = '';
        });

        lectorImagen.readAsDataURL(archivo);
    };

    const registrarEntrega = (evento) => {
        evento.preventDefault();

        const puntosPorAprobar = calcularPuntos();

        if (!puntosPorAprobar || !centroSeleccionado.value || !imagenSeleccionada) {
            mensajeRegistro.textContent = 'Completa todos los datos y adjunta una foto para enviar la entrega.';
            return;
        }

        const nombreMaterial = materialSeleccionado.options[materialSeleccionado.selectedIndex].text.split(' - ')[0];
        const nuevaEntrega = document.createElement('article');
        nuevaEntrega.className = 'entrega-pendiente';

        nuevaEntrega.innerHTML = `
            <img src="${imagenSeleccionada}" alt="Evidencia de ${nombreMaterial}">
            <div>
                <h4>${nombreMaterial}</h4>
                <p>${cantidadMaterial.value} · ${centroSeleccionado.value}</p>
                <span class="estado-pendiente">Pendiente de validación</span>
            </div>
            <strong class="puntos-pendientes">${puntosPorAprobar} pts<small>por aprobar</small></strong>
        `;

        listaEntregas.prepend(nuevaEntrega);

        mensajeRegistro.textContent = `Entrega enviada. ${puntosPorAprobar} puntos quedan pendientes hasta validar la evidencia.`;
        formularioReciclaje.reset();
        puntosEstimados.textContent = '0 pts';
        imagenSeleccionada = '';
        contenedorVistaPrevia.hidden = true;
        vistaPreviaFoto.removeAttribute('src');
    };

    materialSeleccionado.addEventListener('change', calcularPuntos);
    cantidadMaterial.addEventListener('input', calcularPuntos);
    fotoReciclaje.addEventListener('change', mostrarVistaPrevia);
    formularioReciclaje.addEventListener('submit', registrarEntrega);
};
