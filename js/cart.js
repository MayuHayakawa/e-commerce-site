// for store product data thet user add to shopping cart
let shoppingCart = [];
shoppingCart = Object.keys(localStorage).map(key => {
    return JSON.parse(localStorage.getItem(key));
})

const itemQtys = document.querySelectorAll(".item-qty");
let itemCount = shoppingCart.reduce((sum, i) => sum + i.quantity, 0);

// const API = "http://jsonblob.com/api/1072369618240421888"; //add "/api/"

// get API data and display products data for index.html page
// window.addEventListener("load", () => {

    const cartContainer = document.querySelector(".cart-container");
    const emptyCartContainer = document.querySelector(".empty-cart-container");
    
    const cartItems = document.getElementById("cart-items");
    const cartSubtotalPrice = document.querySelector(".cart-subtotal-price");
    
    itemQtys.forEach((element) => {
        if(itemCount != 0) {
            element.innerHTML = itemCount;
        } else {
            element.innerHTML = "";
        }
    });
    
    if(shoppingCart.length != 0) {
        //display user's cart infomation
        cartContainer.classList.remove("cart-hidden");
    
        // create html about items that user added to cart
        for(let i = 0; i < shoppingCart.length; i++) {
            let cartItemRow = document.createElement("tr");
            cartItemRow.classList.add("cart-items-row");
        
            cartItemRow.innerHTML =
            `
            <td class="cart-item-product">
                <div class="cart-item-image">
                    <img src="${shoppingCart[i].image}">
                </div>
                <div class="cart-item-description">
                    <p>${shoppingCart[i].name}</p>
                    <button class="cart-items-remove" value="${shoppingCart[i].name}">Remove</button>
                </div>
            </td>
            <td class="cart-item-price">
                <p>${shoppingCart[i].price}CA$</p>
            </td>
            <td class="cart-item-qty">
                <button class="qty-minus" value="${shoppingCart[i].name}">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <input class="qty-change" type="number" value="${shoppingCart[i].quantity}" name="${shoppingCart[i].name}"
                    min="1" max=99 onkeypress="if(event.keyCode==13){event.returnValue=false}" />
                <button class="qty-plus" value="${shoppingCart[i].name}">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </td>
            <td class="cart-item-total">
                <div>${shoppingCart[i].price * shoppingCart[i].quantity}CA$</div>
            </td>
            `
            cartItems.appendChild(cartItemRow);
        }

        removeItem();
        quantityMinus();
        quantityPlus();
        quantityChange();
        
        //calculation of total
        let subtotalPrice = "";
        subtotalPrice = shoppingCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        cartSubtotalPrice.innerHTML = subtotalPrice + " CA$";
    
    } else {
        //display infomation that users cart is empty
        emptyCartContainer.classList.remove("empty-hidden");
    };
// });

function removeItem() {
    const cartItemsRemove = document.querySelectorAll(".cart-items-remove");

    cartItemsRemove.forEach((element) => {
        element.addEventListener("click", (e) => {
            e.preventDefault();

            // remove item from local strage using key
            let keyName = element.value;
            localStorage.removeItem(keyName);

            // get shoppingCart data from local strage 
            shoppingCart = Object.keys(localStorage).map(key => {
                return JSON.parse(localStorage.getItem(key));
            });

            // reload
            window.location.reload();
            
        })
    })
};

function quantityMinus() {
    const qtyMinus = document.querySelectorAll(".qty-minus");
    
    qtyMinus.forEach((element) => {

        element.addEventListener("click", (e) => {
            e.preventDefault();
            
            let keyName = element.value;
            let data = JSON.parse(localStorage.getItem(keyName));
            let updateInfo = {
                id: data.id,
                name: keyName,
                image: data.image,
                price: data.price,
                quantity: data.quantity - 1
            };
            // console.log(updateInfo);
            
            if(updateInfo.quantity > 0) {
                localStorage.removeItem(keyName);
                localStorage.setItem(keyName,JSON.stringify(updateInfo));
            } else {
                localStorage.removeItem(keyName);
            };

            shoppingCart.push(updateInfo);
            window.location.reload();
        });
    });
};

function quantityPlus() {
    const qtyPlus = document.querySelectorAll(".qty-plus");

    qtyPlus.forEach((element) => {

        element.addEventListener("click", (e) => {
            e.preventDefault();
            
            let keyName = element.value;
            let data = JSON.parse(localStorage.getItem(keyName));
            let currentQuantity = data.quantity;
            let updateQuantity = Number(currentQuantity + 1);
            let updateInfo = {
                id: data.id,
                name: keyName,
                image: data.image,
                price: data.price,
                quantity: updateQuantity
            };
            // console.log(updateInfo);
            
            localStorage.removeItem(keyName);
            localStorage.setItem(keyName,JSON.stringify(updateInfo));
    
            shoppingCart.push(updateInfo);
            window.location.reload();
        });
    });

};

function quantityChange() {
    const qtyChange = document.querySelectorAll(".qty-change");

    qtyChange.forEach((element) => {

        element.addEventListener("keydown", (e) => {

            if(e.key === "Enter") {
                return;
            };
        })

        element.addEventListener("blur", (e) => {
            e.preventDefault();

            console.log(element.value);

            if(!isNaN(element.value)) {
                let keyName = element.name;
                let data = JSON.parse(localStorage.getItem(keyName));
                let updateInfo = {
                    id: data.id,
                    name: keyName,
                    image: data.image,
                    price: data.price,
                    quantity: element.value
                };
                console.log(updateInfo);

                if(updateInfo.quantity > 0) {
                    localStorage.removeItem(keyName);
                    localStorage.setItem(keyName,JSON.stringify(updateInfo));
                } else {
                    localStorage.removeItem(keyName);
                };
    
                shoppingCart.push(updateInfo);
                window.location.reload();
            };
        });
    });
};
