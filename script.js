let carrito = [];
let usuarioActual = { nombre: "", correo: "" };

// Guardar datos del usuario
function guardarUsuario(event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;

    usuarioActual = { nombre, correo };
    
    document.getElementById("saludo-usuario").textContent = `¡Hola, ${nombre}! Tus datos fueron guardados.`;
    alert("¡Registro guardado con éxito!");
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
    }

    actualizarCarritoUI();
    alert(`¡${nombre} agregado al carrito! 🛒`);
}

// Actualizar la interfaz visual del carrito
function actualizarCarritoUI() {
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const contadorCarrito = document.getElementById("contador-carrito");

    let totalArticulos = 0;
    carrito.forEach(item => totalArticulos += item.cantidad);
    contadorCarrito.textContent = totalArticulos;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `<p class="vacio">Tu carrito está vacío.</p>`;
        totalCarrito.textContent = "0";
        return;
    }

    let html = "";
    let total = 0;

    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += `
            <div class="carrito-item">
                <span><strong>${item.nombre}</strong> (x${item.cantidad}) - Bs. ${subtotal}</span>
                <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">❌</button>
            </div>
        `;
    });

    listaCarrito.innerHTML = html;
    totalCarrito.textContent = total;
}

// Eliminar producto individual
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarritoUI();
}

// Enviar pedido completo a WhatsApp con datos de usuario y QR
function enviarPedidoWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Agrega productos antes de realizar el pedido.");
        return;
    }

    const numeroWhatsApp = "59167791788";
    let mensaje = "¡Hola CHOCOSMOS! 🍫 Me gustaría realizar el siguiente pedido:\n\n";

    if (usuarioActual.nombre) {
        mensaje += `👤 *Cliente:* ${usuarioActual.nombre}\n`;
        mensaje += `📧 *Correo:* ${usuarioActual.correo}\n\n`;
    }

    let total = 0;
    carrito.forEach(item => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;
        mensaje += `• ${item.cantidad}x ${item.nombre} - Bs. ${subtotal}\n`;
    });

    mensaje += `\n*Total a pagar: Bs. ${total}*`;
    mensaje += `\n\nRealizaré el pago por QR. Adjunto mi comprobante. ¡Gracias!`;

    let mensajeCodificado = encodeURIComponent(mensaje);
    let urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

    window.open(urlWhatsApp, "_blank");
}