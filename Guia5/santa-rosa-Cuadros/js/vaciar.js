// Confirmación de "Vaciar pedido" con el modal de Bootstrap.
document.getElementById('confirmarVaciar').addEventListener('click', () => {
    pedido.length = 0; // El arreglo de pedido.js
    render();
    anunciar('Se vació el pedido. Total: S/ 0.00.');
    tituloPedido.focus();
});
