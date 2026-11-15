// ===== Semana 4: Manipulación del DOM y eventos =====

// El arreglo es la fuente de verdad del pedido.
// Cada elemento tiene: nombre, precio y cantidad.
const pedido = [];

const listaPedido = document.getElementById('lista-pedido');
const totalPedido = document.getElementById('total-pedido');
const mensajeVacio = document.getElementById('pedido-vacio');
const avisoPedido = document.getElementById('aviso');
const tituloPedido = document.getElementById('titulo-pedido');
const botonVaciar = document.getElementById('vaciar-pedido');
const sugerencia = document.getElementById('sugerencia-mantequilla');
const botonMantequilla = document.getElementById('anadir-mantequilla');

function soles(monto) {
    return `S/ ${monto.toFixed(2)}`;
}

function calcularTotal() {
    return pedido.reduce(
        (suma, item) => suma + item.precio * item.cantidad,
        0
    );
}

function anunciar(mensaje) {
    avisoPedido.textContent = mensaje;
}

// Crea nuevamente la lista a partir del arreglo pedido.
function render() {
    listaPedido.replaceChildren();

    for (const item of pedido) {
        const li = document.createElement('li');

        const texto = document.createElement('span');
        const subtotal = item.precio * item.cantidad;
        texto.textContent =
            `${item.cantidad} × ${item.nombre} · ${soles(subtotal)}`;

        const controles = document.createElement('div');
        controles.className = 'controles-cantidad';

        const restarBtn = document.createElement('button');
        restarBtn.type = 'button';
        restarBtn.className = 'btn-cantidad';
        restarBtn.dataset.accion = 'restar';
        restarBtn.dataset.nombre = item.nombre;
        restarBtn.textContent = '−';
        restarBtn.setAttribute('aria-label', `Restar una unidad de ${item.nombre}`);

        const sumarBtn = document.createElement('button');
        sumarBtn.type = 'button';
        sumarBtn.className = 'btn-cantidad';
        sumarBtn.dataset.accion = 'sumar';
        sumarBtn.dataset.nombre = item.nombre;
        sumarBtn.textContent = '+';
        sumarBtn.setAttribute('aria-label', `Sumar una unidad de ${item.nombre}`);

        const quitarBtn = document.createElement('button');
        quitarBtn.type = 'button';
        quitarBtn.className = 'btn-quitar';
        quitarBtn.dataset.accion = 'quitar';
        quitarBtn.dataset.nombre = item.nombre;
        quitarBtn.textContent = 'Quitar';
        quitarBtn.setAttribute('aria-label', `Quitar ${item.nombre} del pedido`);

        controles.append(restarBtn, sumarBtn, quitarBtn);
        li.append(texto, controles);
        listaPedido.append(li);
    }

    totalPedido.textContent = soles(calcularTotal());
    mensajeVacio.hidden = pedido.length > 0;
    if (botonVaciar) botonVaciar.disabled = pedido.length === 0;

    // La sugerencia aparece solo si hay pan en el pedido.
    const hayPan = pedido.some(item =>
        ['Pan francés', 'Pan de yema', 'Chancay'].includes(item.nombre)
    );
    const yaTieneMantequilla = pedido.some(
        item => item.nombre === 'Mantequilla'
    );
    sugerencia.hidden = !hayPan || yaTieneMantequilla;
}

function agregar(nombre, precio) {
    const existente = pedido.find(item => item.nombre === nombre);

    if (existente) {
        existente.cantidad++;
    } else {
        pedido.push({ nombre, precio, cantidad: 1 });
    }

    render();
    anunciar(`Se añadió ${nombre}. Total: ${soles(calcularTotal())}.`);
}

function cambiarCantidad(nombre, cambio) {
    const item = pedido.find(producto => producto.nombre === nombre);
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        const posicion = pedido.findIndex(producto => producto.nombre === nombre);
        pedido.splice(posicion, 1);
        anunciar(`Se quitó ${nombre} porque su cantidad llegó a cero.`);
    } else {
        anunciar(`Cantidad de ${nombre}: ${item.cantidad}.`);
    }

    render();
}

function quitar(nombre) {
    const posicion = pedido.findIndex(item => item.nombre === nombre);
    if (posicion === -1) return;

    pedido.splice(posicion, 1);
    render();
    anunciar(`Se quitó ${nombre}. Total: ${soles(calcularTotal())}.`);

    // El foco pasa a un lugar lógico después de reconstruir la lista.
    tituloPedido.focus();
}

// Delegación de eventos: un solo listener atiende todos los botones Añadir.
document.querySelector('.catalogo').addEventListener('click', evento => {
    const boton = evento.target.closest('.btn-anadir');
    if (!boton) return;

    const producto = boton.closest('.producto');
    agregar(
        producto.dataset.nombre,
        Number(producto.dataset.precio)
    );
});

// Delegación de eventos para los botones creados dinámicamente en la lista.
listaPedido.addEventListener('click', evento => {
    const boton = evento.target.closest('button[data-accion]');
    if (!boton) return;

    const nombre = boton.dataset.nombre;
    const accion = boton.dataset.accion;

    if (accion === 'sumar') cambiarCantidad(nombre, 1);
    if (accion === 'restar') cambiarCantidad(nombre, -1);
    if (accion === 'quitar') quitar(nombre);
});

// Acción destructiva: siempre pide confirmación antes de vaciar.
botonVaciar.addEventListener('click', () => {
    if (pedido.length === 0) return;

    const confirmar = window.confirm('¿Seguro que deseas vaciar todo el pedido?');
    if (!confirmar) return;

    pedido.length = 0;
    render();
    anunciar('El pedido se vació correctamente.');
    tituloPedido.focus();
});

// La sugerencia es transparente: el cliente decide si la agrega.
botonMantequilla.addEventListener('click', () => {
    agregar('Mantequilla', 2.50);
});

// Dibujo inicial: muestra el estado vacío y el total en cero.
render();
