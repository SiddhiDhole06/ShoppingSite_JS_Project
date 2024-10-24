let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let filterItems = document.querySelectorAll('.list'); // For the filter buttons


let listProducts = [];
let carts = [];

iconCart.addEventListener('click', ()=>{
    body.classList.toggle('showCart')
})

closeCart.addEventListener('click', ()=>{
    body.classList.toggle('showCart')
})




// Function to filter products by category
const filterProducts = (category) => {
    let filteredProducts = listProducts.filter(product => category === "all" ? true : product.category === category);
    addDataToHTML(filteredProducts);
};
// Add filtered data to the HTML
const addDataToHTML = (products) => {
    listProductHTML.innerHTML = "";
    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.dataset.category = product.category;
            newProduct.innerHTML = `
                <img src="${product.image}">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">
                    Add To Cart
                </button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};
// Filter products when clicking the filter buttons
filterItems.forEach(item => {
    item.addEventListener('click', (event) => {
        // Remove active class from all filter buttons
        filterItems.forEach(el => el.classList.remove('active'));
        // Add active class to the clicked filter
        event.target.classList.add('active');
        
        let category = event.target.dataset.filter;
        filterProducts(category);
    });
});



listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
});
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
        carts = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }

    addCartToHTML();
    addCartToMemory();
};
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
};
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    $${info.price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
                `;
                listCartHTML.appendChild(newCart)
        })
    }
    iconCartSpan.innerText = totalQuantity;
}




listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantity(product_id, type);
    }
});

const changeQuantity = (product_id, type) =>{
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id)
    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity +  1;
                
                break;
        
            default:
                let valueChange =  carts[positionItemInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange
                }
                else{
                    carts.splice(positionItemInCart, 1)
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();

}

const initApp = () => {
    fetch("products.json")
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            filterProducts("all");

            if (localStorage.getItem('cart')) {
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
};

initApp();


