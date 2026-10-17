// Funciones relacionadas con el filtro y el canje del catálogo de premios.
export const inicializarPremios = () => {
    const botonesCategoria = document.querySelectorAll('[data-categoria]');
    const totalPuntos = document.querySelector('#total-puntos');
    const perfilPuntos = document.querySelector('#perfil-puntos');
    const saldoPremios = document.querySelector('#saldo-premios');
    const mensajePremios = document.querySelector('#mensaje-premios');
    const listaCanjes = document.querySelector('#lista-canjes');
    const seccionCanjes = document.querySelector('#canjes-realizados');
    const modalCanje = document.querySelector('#modal-canje');
    const modalPremioNombre = document.querySelector('#modal-premio-nombre');
    const modalPremioCosto = document.querySelector('#modal-premio-costo');
    const botonCancelar = document.querySelector('#cancelar-canje');
    const botonConfirmar = document.querySelector('#confirmar-canje');
    let premioSeleccionado = null;

    const formatearNumero = (numero) => {
        return numero.toLocaleString('es-CO');
    };

    const formatearFecha = (fecha) => {
        return fecha.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const generarCodigo = (tipoPremio) => {
        const prefijos = {
            tienda: 'TIE',
            reconocimiento: 'REC',
            sostenible: 'KIT',
            experiencia: 'EXP'
        };

        const prefijo = prefijos[tipoPremio] || 'ECO';
        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
        return `${prefijo}-${numeroAleatorio}`;
    };

    const actualizarSaldos = (nuevoSaldo) => {
        totalPuntos.textContent = nuevoSaldo;

        if (perfilPuntos) {
            perfilPuntos.textContent = formatearNumero(nuevoSaldo);
        }

        if (saldoPremios) {
            saldoPremios.textContent = `${formatearNumero(nuevoSaldo)} pts`;
        }
    };

    const actualizarEstadoBotones = () => {
        const botonesCanjear = document.querySelectorAll('[data-canjear]');
        const puntosDisponibles = Number(totalPuntos.textContent);

        botonesCanjear.forEach((botonCanjear) => {
            const costoPremio = Number(botonCanjear.dataset.canjear);
            const puntosFaltantes = costoPremio - puntosDisponibles;

            if (puntosFaltantes > 0) {
                botonCanjear.disabled = true;
                botonCanjear.textContent = `Te faltan ${formatearNumero(puntosFaltantes)} pts`;
            } else {
                botonCanjear.disabled = false;
                botonCanjear.textContent = 'Canjear';
            }
        });
    };

    const filtrarPremios = (categoriaSeleccionada) => {
        document.querySelectorAll('.premio-card').forEach((tarjetaPremio) => {
            const mostrarPremio = categoriaSeleccionada === 'todos' || tarjetaPremio.dataset.tipo === categoriaSeleccionada;
            tarjetaPremio.classList.toggle('oculto', !mostrarPremio);
        });
    };

    const abrirConfirmacion = (botonCanjear) => {
        premioSeleccionado = botonCanjear;
        modalPremioNombre.textContent = botonCanjear.dataset.premio;
        modalPremioCosto.textContent = `${formatearNumero(Number(botonCanjear.dataset.canjear))} pts`;
        modalCanje.classList.remove('oculto-modal');
        modalCanje.setAttribute('aria-hidden', 'false');
    };

    const cerrarConfirmacion = () => {
        modalCanje.classList.add('oculto-modal');
        modalCanje.setAttribute('aria-hidden', 'true');
        premioSeleccionado = null;
    };

    const obtenerInstruccionCanje = (tipoPremio, fechaVencimiento) => {
        if (tipoPremio === 'tienda') {
            return `Presenta este código en el establecimiento participante antes del ${fechaVencimiento}.`;
        }

        if (tipoPremio === 'reconocimiento') {
            return `Presenta este código para solicitar tu diploma digital antes del ${fechaVencimiento}.`;
        }

        if (tipoPremio === 'sostenible') {
            return `Presenta este código en el punto ECOCANJE para reclamar el kit antes del ${fechaVencimiento}.`;
        }

        return `Presenta este código para reclamar el beneficio antes del ${fechaVencimiento}.`;
    };

    const agregarCanje = (nombrePremio, tipoPremio, codigoGenerado, fechaVencimiento) => {
        const mensajeVacio = listaCanjes.querySelector('.canje-vacio');

        if (mensajeVacio) {
            mensajeVacio.remove();
        }

        const nuevoCanje = document.createElement('article');
        nuevoCanje.className = 'canje-item';
        const instruccionCanje = obtenerInstruccionCanje(tipoPremio, fechaVencimiento);

        nuevoCanje.innerHTML = `
            <div class="canje-detalle">
                <strong>${nombrePremio}</strong>
                <p>${instruccionCanje} El código es válido durante 7 días.</p>
            </div>
            <div class="codigo-canje">${codigoGenerado}</div>
        `;

        listaCanjes.prepend(nuevoCanje);
    };

    const canjearPremio = (botonCanjear) => {
        const costoPremio = Number(botonCanjear.dataset.canjear);
        const nombrePremio = botonCanjear.dataset.premio;
        const tipoPremio = botonCanjear.dataset.tipo;
        const puntosDisponibles = Number(totalPuntos.textContent);

        if (puntosDisponibles < costoPremio) {
            const puntosFaltantes = costoPremio - puntosDisponibles;
            mensajePremios.textContent = `Te faltan ${formatearNumero(puntosFaltantes)} puntos para canjear ${nombrePremio}.`;
            return;
        }

        const nuevoSaldo = puntosDisponibles - costoPremio;
        const codigoGenerado = generarCodigo(tipoPremio);
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 7);
        const vencimientoFormateado = formatearFecha(fechaVencimiento);

        actualizarSaldos(nuevoSaldo);
        agregarCanje(nombrePremio, tipoPremio, codigoGenerado, vencimientoFormateado);
        actualizarEstadoBotones();

        mensajePremios.textContent = `Canje realizado. Código ${codigoGenerado}. Válido hasta el ${vencimientoFormateado}.`;

        seccionCanjes.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    botonesCategoria.forEach((botonCategoria) => {
        botonCategoria.addEventListener('click', () => {
            const categoriaSeleccionada = botonCategoria.dataset.categoria;

            botonesCategoria.forEach((boton) => {
                boton.classList.remove('categoria-activa');
            });

            botonCategoria.classList.add('categoria-activa');
            filtrarPremios(categoriaSeleccionada);
        });
    });

    document.querySelectorAll('[data-canjear]').forEach((botonCanjear) => {
        botonCanjear.addEventListener('click', () => {
            abrirConfirmacion(botonCanjear);
        });
    });

    botonCancelar.addEventListener('click', cerrarConfirmacion);

    botonConfirmar.addEventListener('click', () => {
        if (!premioSeleccionado) {
            return;
        }

        const botonElegido = premioSeleccionado;
        cerrarConfirmacion();
        canjearPremio(botonElegido);
    });

    modalCanje.addEventListener('click', (evento) => {
        if (evento.target === modalCanje) {
            cerrarConfirmacion();
        }
    });

    actualizarSaldos(Number(totalPuntos.textContent));
    actualizarEstadoBotones();
};
