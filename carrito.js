let cart = [];

// Cargar el carrito del Local Storage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
    renderCartItems();
  }
}

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0); 
  $('.cart-count').text(cartCount);
}

// Crear o Agregar al carrito (C del CRUD)
$('.add-to-cart').click(function (e) {
  e.preventDefault();
  const plan = $(this).data('plan');
  const price = parseFloat($(this).data('price'));

  // Comprobar si el producto ya está en el carrito
  const existingProduct = cart.find(item => item.plan === plan);
  if (existingProduct) {
    existingProduct.quantity++; 
  } else {
    cart.push({ plan, price, quantity: 1 }); 
  }

  updateCartCount();
  renderCartItems();
  saveCartToLocalStorage(); // Guardar en Local Storage

  // Mostrar el modal
  $('#addedToCartModal').modal('show');
});

// Leer y Renderizar los elementos del carrito (R del CRUD)
function renderCartItems() {
  $('#cart-items').empty(); 
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    $('#cart-items').append(`
      <li class="list-group-item d-flex justify-content-between align-items-center">
        ${item.plan} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}
        <div>
          <button class="btn btn-secondary btn-sm update-quantity" data-plan="${item.plan}" data-action="increase">+</button>
          <button class="btn btn-secondary btn-sm update-quantity" data-plan="${item.plan}" data-action="decrease">-</button>
          <button class="btn btn-danger btn-sm remove-item" data-plan="${item.plan}">Eliminar</button>
        </div>
      </li>
    `);
  });

  $('#cart-total').text(total.toFixed(2));

  // Agregar evento para actualizar cantidad de un artículo
  $('.update-quantity').off('click').on('click', function () {
    const planToUpdate = $(this).data('plan');
    const action = $(this).data('action');
    updateCartItem(planToUpdate, action);
  });

  // Agregar evento para eliminar un artículo (D del CRUD)
  $('.remove-item').off('click').on('click', function () {
    const planToRemove = $(this).data('plan');
    cart = cart.filter(item => item.plan !== planToRemove); // Elimina el producto
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage(); // Guardar en Local Storage
  });
}

// Actualizar cantidad de un artículo (U del CRUD)
function updateCartItem(plan, action) {
  const item = cart.find(item => item.plan === plan);
  if (item) {
    if (action === 'increase') {
      item.quantity++; // Aumentar cantidad
    } else if (action === 'decrease') {
      item.quantity--; // Disminuir cantidad
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.plan !== plan); // Eliminar si cantidad es cero
      }
    }
    updateCartCount();
    renderCartItems();
    saveCartToLocalStorage(); // Guardar en Local Storage
  }
}

// Vaciar el carrito (D del CRUD)
$('#emptyCartButton').click(function () {
  cart = []; // Limpia el carrito
  updateCartCount(); // Actualiza el contador
  renderCartItems(); // Renderiza los elementos del carrito (vacío)
  saveCartToLocalStorage(); // Limpia el Local Storage
});

$(document).ready(function () {
  loadCartFromLocalStorage();
});

