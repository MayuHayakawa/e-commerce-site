// for store product data thet user add to shopping cart
let shoppingCart = [];
shoppingCart = Object.keys(localStorage).map(key => {
    return JSON.parse(localStorage.getItem(key));
})

const API = "http://jsonblob.com/api/1146207361479598080";
// const API = "http://jsonblob.com/api/1072369618240421888"; //add "/api/"

const itemQtys = document.querySelectorAll(".item-qty");
let itemCount = shoppingCart.reduce((sum, i) => sum + i.quantity, 0);

// get API data and display products data for index.html page
window.addEventListener("load", () => {
    const featuredProducts = document.getElementById("featured-products");
    const featuredOnSale = document.getElementById("featured-on-sale");

    console.log(itemCount);
    
    itemQtys.forEach((element) => {
        if(itemCount != 0) {
            element.innerHTML = itemCount;
        } else {
            element.innerHTML = "";
        }
    });
    
    axios.get(API)
        .then((res) => {
            // console.log(res);
            res.data.nailTips.forEach((product) => {

                let productCard = document.createElement("li");
                productCard.classList.add("product-card");

                if(product.onsale != true) { //not on sale
                    productCard.innerHTML =
                    `
                    <div class="product-image">
                        <img src="${product.image}" />
                    </div>
                    <p>${product.name}</p>
                    <p>${product.price}CA$</p>
                    <button class="add-to-cart-button" value="${product.id}">ADD TO CART</button>
                    `
                    // console.log(productCard);
                    featuredProducts.appendChild(productCard);
                } else { //on sale
                    productCard.innerHTML =
                    `
                    <div class="product-image">
                        <img src="${product.image}" />
                    </div>
                    <p>${product.name}</p>
                    <div class="sale-price">
                        <p class="original-price">${product.price}CA$</p>
                        <p>→</p>
                        <p>${product.saleprice}CA$</p>           
                    </div>
                    <button class="add-to-cart-button" value="${product.id}">ADD TO CART</button>
                    `
                    // console.log(productCard);
                    featuredOnSale.appendChild(productCard);
                };
            });
            addCart(res);
        });
});

// add production info to local strage when user click "ADD TO CART" button
function addCart(res) {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
    const cartPopup = document.querySelector(".cart-popup");
    const cartPopupItemImageSrc = document.querySelector(".cart-popup-item-image-src");
    const cartPopupItemDescriptionName = document.querySelector(".cart-popup-item-description-name");
    const cartPopupClose = document.querySelectorAll(".cart-popup-close");
    
    addToCartButtons.forEach((element) => {
        let productId = element.value; // create valiable to get product info with nailTip's id
        
        element.addEventListener("click", (e) => {
            e.preventDefault();

            shoppingCart = Object.keys(localStorage).map(key => {
                return JSON.parse(localStorage.getItem(key));
            });

            let productInfo = {};
            
            if(res.data.nailTips[productId].saleprice == "") {
                productInfo = {
                    id: productId,
                    name: res.data.nailTips[productId].name,
                    image: res.data.nailTips[productId].image,
                    price: res.data.nailTips[productId].price,
                    quantity: 1
                }
            } else {
                productInfo = {
                    id: productId,
                    name: res.data.nailTips[productId].name,
                    image: res.data.nailTips[productId].image,
                    price: res.data.nailTips[productId].saleprice,
                    quantity: 1
                }
            }

            console.log(productInfo);

            let keyName = productInfo.name;
            
            if(JSON.parse(localStorage.getItem(keyName))) {
                let data = JSON.parse(localStorage.getItem(keyName));
                productInfo.quantity = data.quantity + 1;
                localStorage.removeItem(keyName);
            }
            // add item that user choices to local storage
            localStorage.setItem(keyName,JSON.stringify(productInfo));
            shoppingCart.push(productInfo);
            console.log(shoppingCart);


            // add item infomation to pop-up window
            cartPopupItemImageSrc.setAttribute("src", `${productInfo.image}`);
            cartPopupItemDescriptionName.innerHTML = productInfo.name;

            itemCount++;
            itemQtys.forEach((element) => {
                element.innerHTML = itemCount;
            });
            console.log("f" + itemCount);

            // display pop-up window
            cartPopup.classList.remove("popup-hidden");
            cartPopup.classList.add("popup-message");
            
            // hide pop-up window
            cartPopup.addEventListener("animationend", () => {
                cartPopup.classList.remove("popup-message");
                cartPopup.classList.add("popup-hidden");
            });
        });
    });

    cartPopupClose.forEach((element) => {
        element.addEventListener("click", (e) => {
            e.preventDefault();
            cartPopup.classList.add("popup-hidden");
        });
    });

};
