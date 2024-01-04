let products = [];
let cart = [];
let wishlist = [];

const sidebar = document.getElementById('sidebar');
const cartItems = document.getElementById('cartItems');
const subtotalElement = document.getElementById('subtotal');
const gstElement = document.getElementById('gst');
const totalElement = document.getElementById('total');
const wishlistIcon = document.querySelector('.wishlist-icon');
let slide = document.querySelectorAll(".slideCard");
let card = document.querySelectorAll(".card");




let count = 0;

slide.forEach(function(slides, index){
    slides.style.left=`${index *100}%`
})

function myFun(){
    slide.forEach(function(curVal){
        curVal.style.transform=`translateX(-${count *100}%)`
    
    })

}

setInterval(function(){
    count++;
    if(count == slide.length){
        count=0;
    }
    myFun()
},2000)



fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        products = data;
        displayProducts();
    })
    .catch(error => {
        console.error('Error fetching product data:', error);
    });

function displayProducts(filteredProducts = []) {
    const productDisplay = document.getElementById('productDisplay');
    productDisplay.innerHTML = '';

    const productsToDisplay = filteredProducts.length > 0 ? filteredProducts : products;

    productsToDisplay.forEach(product => {
        const productElement = document.createElement('div');
        const isProductInWishlist = wishlist.some(item => item.productId === product.id);
        productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="max-width: 100%;">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button class="addToCart" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="wishlist" onclick="toggleWishlistItem(${product.id})" class="${isProductInWishlist ? 'in-wishlist' : ''}">
                    ${isProductInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </button>
                
            `;
        productDisplay.appendChild(productElement);
    });
}

function addToCart(productId) {

    const productToAdd = products.find(product => product.id === productId);

    if (productToAdd) {

        const existingCartItem = cart.find(item => item.productId === productId);

        if (existingCartItem) {

            existingCartItem.quantity++;
        } else {

            cart.push({ productId: productId, quantity: 1 });
        }

        updateCart();


        updateCartIcon();


    }
}

function updateCartIcon() {

    const cartQuantitySpan = document.getElementById('cartQuantity');
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartQuantitySpan.textContent = ` (${totalQuantity})`;
}




function incrementQuantity(productId) {
    const cartItem = findCartItem(productId);
    if (cartItem) {
        cartItem.quantity++;
    }
    updateCart();
}

function decrementQuantity(productId) {
    const cartItem = findCartItem(productId);
    if (cartItem && cartItem.quantity > 1) {
        cartItem.quantity--;
    }
    updateCart();
}

function updateCart() {
    cartItems.innerHTML = '';
    let cartSubtotal = 0;

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            const cartItemElement = document.createElement('li');
            cartItemElement.innerHTML = `
            <button class="delete-icon" onclick="removeCartItem(${cartItem.productId})"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                <div class="cart-item">
                    <div class="item-image">
                        <img src="${product.image}" alt="${product.name}" style="max-width: 100%;">
                    </div>
                    <div class="item-details">
                    <p>${product.name} </p>
                        <div class="buttons">
                            <button class="plus" onclick="incrementQuantity(${cartItem.productId})">+</button>
                            <span>${cartItem.quantity}</span>
                            <button class="minus" onclick="decrementQuantity(${cartItem.productId})">-</button>
                            
                        </div>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItemElement);

            cartSubtotal += product.price * cartItem.quantity;
        }
    });

    const gst = 0.1 * cartSubtotal;
    const total = cartSubtotal + gst;
    subtotalElement.textContent = cartSubtotal.toFixed(2);
    gstElement.textContent = gst.toFixed(2);
    totalElement.textContent = total.toFixed(2);
}


function removeCartItem(productId) {
    const index = cart.findIndex(item => item.productId === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
        updateCartIcon();
    }
}

function searchProduct() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    console.log('Search Term:', searchTerm);
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
    console.log('Filtered Products:', filteredProducts);
    displayProducts(filteredProducts);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isSidebarOpen = sidebar.style.width === '250px';
    

    if (isSidebarOpen) {
        sidebar.style.width = '0';
    } else {
        sidebar.style.width = '250px';
        sidebar.style.right = '0';
    }
}



function toggleWishlistItem(productId) {
    const index = wishlist.findIndex(item => item.productId === productId);
    if (index !== -1) {

        wishlist.splice(index, 1);
    } else {

        wishlist.push({ productId: productId });
    }

    updateWishlistIcon();
}

function showWishlistProducts() {

    console.log('Wishlist:', wishlist);


    window.location.href = `wishlist.html?wishlist=${encodeURIComponent(JSON.stringify(wishlist))}`;
}


function updateWishlistIcon() {
    const wishlistCount = wishlist.length;
    wishlistIcon.textContent = `Wishlist (${wishlistCount})`;
    wishlistIcon.onclick = showWishlistProducts;
}


function toggleWishlist() {

    console.log(wishlist);


    // window.location.href = 'wishlist.html';
}

function findCartItem(productId) {
    return cart.find(cartItem => cartItem.productId === productId);
}

function displayWishlist() {
    const wishlistDisplay = document.getElementById('wishlistDisplay');
    wishlistDisplay.innerHTML = '';

    wishlist.forEach(wishlistItem => {
        const product = products.find(p => p.id === wishlistItem.productId);
        if (product) {
            const wishlistItemElement = document.createElement('div');
            wishlistItemElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button onclick="removeFromWishlist(${product.id})">Remove from Wishlist</button>
            `;
            wishlistDisplay.appendChild(wishlistItemElement);
        }
    });
}

function removeFromWishlist(productId) {
    const index = wishlist.findIndex(item => item.productId === productId);
    if (index !== -1) {
        wishlist.splice(index, 1);
        displayWishlist();
        updateWishlistIcon();
    }
}

displayProducts();
updateCart();
updateWishlistIcon();
