// var
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const optionBtn = document.querySelectorAll('.size-btn');
const filterAll = document.querySelector('.all');
const filterUs = document.querySelector('.us');
const filterRoadster = document.querySelector('.roadster');
const filterGap = document.querySelector('.gap');
const sizeXS = document.querySelector('.xs');
const sizeS = document.querySelector('.s');
const sizeM = document.querySelector('.m');
const sizeL = document.querySelector('.l');

// cart
let cart = [];
// buttons
let buttonsDOM = [];




//getting the products
class Products{

    async getProducts(){
        try{
            let result = await fetch('products1.json');
            let products = await result.json();
            return products;
        } catch (error){
            console.log(error);
        }
    }

}

//display products
class UI{
displayProducts(products){
    //console.log(products);
    let result = '';
    products.forEach(products => {
        let option = products.options;
        
        
        result +=
`       
        <!-- single product-->
        <article class="product">
          <div class="img-container">
            <img
              src=${products.image_src}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${products.id}>
              <i class="fas fa-shopping-cart">add to cart</i>
            </button>
            <div class="size-option">
            `;
              option.forEach(optionItem =>{
            let optionValue = optionItem.value;
            //console.log(optionValue);
            result +=
            `
            </button>
             <button class="size-btn" data-id=${products.id}>
              <i class="size">${optionValue}</i>
            </button>`;
            });
            result +=
            `
            </div>
          </div>
          <h3>${products.name}</h3>
          <h4>$${products.price}</h4>
        </article>
        <!-- end of products-->
        `;
    });
    productsDOM.innerHTML = result;
}
getBagButtons(){

    //sizeOption
    const sizeOption = [...document.querySelectorAll(".size-btn")];
    sizeOption.forEach(option => {
        let id = option.dataset.id;
        option.addEventListener('click', (event)=> {
            if(option.style.background == "blue"){
                option.style.background = "transparent";
            }
            else{
            option.style.background = "blue";
            }
            // get product from products
            let optionName = option.textContent.replace(/[\n\r]+|[\s]{2,}/g, ' ').trim()
            //console.log(optionName);
            let cartItem = {...Storage.getProduct(id), size:optionName};
            //console.log(cartItem);
        })
    })
    
    //bag buttons
    const buttons = [...document.querySelectorAll(".bag-btn")];
    //console.log(buttons);
    buttonsDOM = buttons;
    buttons.forEach(button => {
        let id = button.dataset.id;
        //console.log(typeof(id));
       let inCart = cart.find(item => item.id === id);
       if(inCart){
           button.innerText = "In Cart";
           button.disabled = true;
       }
       else{
           button.addEventListener('click', (event)=>{
               event.target.innerText = "In Cart";
               event.target.disabled = true;
               // get product from products
               let cartItem = {...Storage.getProduct(id), amount:1};
               //console.log(cartItem);
               // add product to the cart
               cart = [...cart,cartItem];
               //console.log(cart);
               // save cart in local storage
               Storage.saveCart(cart);
               // set cart values
               this.setCartValues(cart);
               // display cart items
               this.addCartItem(cartItem);
               // show the cart
               //this.showCart();
           });
       }
    })
}
setCartValues(cart){
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
        tempTotal += item.price* item.amount;
        itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    //console.log(cartTotal);
    cartItems.innerText = itemsTotal;
    //console.log(cartItems);
}
addCartItem(item){
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
     <img src=${item.image_src} alt="product" />
            <div>
              <h4>${item.name}</h4>
              <h5>$${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
              </div>
    `;
    cartContent.appendChild(div);
    //console.log(cartContent);
}

showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
    
}

setupAPP(){
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populate(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
    this.hideCart();
    this.cartLogic();
   
}


populate(cart){
    cart.forEach(item => this.addCartItem(item));
}

hideCart(){
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');

}
cartLogic(){
    //clear cart button
    clearCartBtn.addEventListener('click', () => {
       this.clearCart();
    });
    //cart functionality
    cartContent.addEventListener('click', event => {
        if(event.target.classList.contains('remove-item')){
            let removeItem = event.target;
            let id = removeItem.dataset.id;
            this.removeItem(id);
            cartContent.removeChild(removeItem.parentElement.parentElement);
        }
        else if(event.target.classList.contains('fa-chevron-up')){
            let addAmount = event.target;
            let id = addAmount.dataset.id;
            let tempItem = cart.find(item => item.id == id);
            tempItem.amount = tempItem.amount +1;
            Storage.saveCart(cart);
            this.setCartValues(cart);
            addAmount.nextElementSibling.innerText = tempItem.amount;
        }
        else if (event.target.classList.contains('fa-chevron-down')){

            let lowerAmount = event.target;
            let id = lowerAmount.dataset.id;
            let tempItem = cart.find(item => item.id == id);
            tempItem.amount = tempItem.amount - 1;
            if(tempItem.amount>0){
            Storage.saveCart(cart);
            this.setCartValues(cart);
            lowerAmount.previousElementSibling.innerText = tempItem.amount;

            }
            else{
                cartContent.removeChild(lowerAmount.parentElement.parentElement);
                this.removeItem(id);
            }


        }
    });
}
clearCart(){
    let cartItems = cart.map(item => item.id);
    cartItems.forEach(id => this.removeItem(id));
    //console.log(cartContent.children);
    while(cartContent.children.length>0){
        cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
}
removeItem(id){
    cart = cart.filter(item => item.id != id);
    //console.log(cart);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shooping-cart"></i>add to cart`;
}
getSingleButton(id){
    return buttonsDOM.find(button => button.dataset.id ==id);
}
applyFilter(products){
    
    filterUs.addEventListener('click', event => {
        let result = '';
        //console.log(products);
        products.forEach(products => {
        let option = products.options;
        let vendor = products.vendor;
        if(products.vendor=="U.S Polo Assn."){
        //console.log(vendor);
        
        result +=
`       
        <!-- single product-->
        <article class="product">
          <div class="img-container">
            <img
              src=${products.image_src}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${products.id}>
              <i class="fas fa-shopping-cart">add to cart</i>
            </button>
            <div class="size-option">
            `;
              option.forEach(optionItem =>{
            let optionValue = optionItem.value;
            //console.log(optionValue);
            result +=
            `
            </button>
             <button class="size-btn" data-id=${products.id}>
              <i class="size">${optionValue}</i>
            </button>`;
            });
            result +=
            `
            </div>
          </div>
          <h3>${products.name}</h3>
          <h4>$${products.price}</h4>
        </article>
        <!-- end of products-->
        `;
        }
    });
    productsDOM.innerHTML = result;
   //console.log(result);
});
        

        filterRoadster.addEventListener('click', event => {
        let result = '';
        //console.log(products);
        products.forEach(products => {
        let option = products.options;
        let vendor = products.vendor;
        console.log(vendor);
         if(products.vendor=="Roadster"){
             console.log(vendor);
        
        result +=
`       
        <!-- single product-->
        <article class="product">
          <div class="img-container">
            <img
              src=${products.image_src}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${products.id}>
              <i class="fas fa-shopping-cart">add to cart</i>
            </button>
            <div class="size-option">
            `;
              option.forEach(optionItem =>{
            let optionValue = optionItem.value;
            //console.log(optionValue);
            result +=
            `
            </button>
             <button class="size-btn" data-id=${products.id}>
              <i class="size">${optionValue}</i>
            </button>`;
            });
            result +=
            `
            </div>
          </div>
          <h3>${products.name}</h3>
          <h4>$${products.price}</h4>
        </article>
        <!-- end of products-->
        `;
        }
         });
    productsDOM.innerHTML = result;
   //console.log(result);
});
        filterAll.addEventListener('click', event => {
        this.displayProducts(products);
        });

        sizeXS.addEventListener('click', event => {
        let result = '';
        //console.log(products);
        products.forEach(products => {
        let option = products.options;
        var size;
        option.forEach(optionItem =>{
            if(optionItem.value == "xs"){
                size = optionItem.value;
            }
        });
         if(size=="xs"){
           //  console.log(vendor);
        
        result +=
`       
        <!-- single product-->
        <article class="product">
          <div class="img-container">
            <img
              src=${products.image_src}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${products.id}>
              <i class="fas fa-shopping-cart">add to cart</i>
            </button>
            <div class="size-option">
            `;
              option.forEach(optionItem =>{
            let optionValue = optionItem.value;
            //console.log(optionValue);
            result +=
            `
            </button>
             <button class="size-btn" data-id=${products.id}>
              <i class="size">${optionValue}</i>
            </button>`;
            });
            result +=
            `
            </div>
          </div>
          <h3>${products.name}</h3>
          <h4>$${products.price}</h4>
        </article>
        <!-- end of products-->
        `;
        }
         });
    productsDOM.innerHTML = result;
        });

        sizeS.addEventListener('click', event => {
        let result = '';
        //console.log(products);
        products.forEach(products => {
        let option = products.options;
        var size;
        option.forEach(optionItem =>{
            if(optionItem.value == "small"){
                size = optionItem.value;
            }
            //console.log(optionItem);
        });
         if(size=="small"){
           //  console.log(vendor);
        
        result +=
`       
        <!-- single product-->
        <article class="product">
          <div class="img-container">
            <img
              src=${products.image_src}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${products.id}>
              <i class="fas fa-shopping-cart">add to cart</i>
            </button>
            <div class="size-option">
            `;
              option.forEach(optionItem =>{
            let optionValue = optionItem.value;
            //console.log(optionValue);
            result +=
            `
            </button>
             <button class="size-btn" data-id=${products.id}>
              <i class="size">${optionValue}</i>
            </button>`;
            });
            result +=
            `
            </div>
          </div>
          <h3>${products.name}</h3>
          <h4>$${products.price}</h4>
        </article>
        <!-- end of products-->
        `;
        }
         });
    productsDOM.innerHTML = result;
        });

        sizeM.addEventListener('click', event => {
        let result = '';
        console.log(products);
        products.forEach(products => {
        let option = products.options;
        var size;
        option.forEach(optionItem =>{
            console.log(optionItem);
            if(optionItem.value == "medium"){
                size = optionItem.value;
            }
        });
         if(size=="medium"){
           //  console.log(vendor);
        
        result +=
`       
        <!-- single product-->
        <article class="product">
          <div class="img-container">
            <img
              src=${products.image_src}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${products.id}>
              <i class="fas fa-shopping-cart">add to cart</i>
            </button>
            <div class="size-option">
            `;
              option.forEach(optionItem =>{
            let optionValue = optionItem.value;
            //console.log(optionValue);
            result +=
            `
            </button>
             <button class="size-btn" data-id=${products.id}>
              <i class="size">${optionValue}</i>
            </button>`;
            });
            result +=
            `
            </div>
          </div>
          <h3>${products.name}</h3>
          <h4>$${products.price}</h4>
        </article>
        <!-- end of products-->
        `;
        }
    });
    productsDOM.innerHTML = result;
        });

        sizeL.addEventListener('click', event => {
        let result = '';
        //console.log(products);
        products.forEach(products => {
        let option = products.options;
        var size;
        option.forEach(optionItem =>{
            if(optionItem.value == "large"){
                size = optionItem.value;
            }
        });
         if(size=="large"){
           //  console.log(vendor);
        
        result +=
`       
        <!-- single product-->
        <article class="product">
          <div class="img-container">
            <img
              src=${products.image_src}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${products.id}>
              <i class="fas fa-shopping-cart">add to cart</i>
            </button>
            <div class="size-option">
            `;
              option.forEach(optionItem =>{
            let optionValue = optionItem.value;
            //console.log(optionValue);
            result +=
            `
            </button>
             <button class="size-btn" data-id=${products.id}>
              <i class="size">${optionValue}</i>
            </button>`;
            });
            result +=
            `
            </div>
          </div>
          <h3>${products.name}</h3>
          <h4>$${products.price}</h4>
        </article>
        <!-- end of products-->
        `;
        }
         });
    productsDOM.innerHTML = result;
});
filterGap.addEventListener('click', event => {
        let result = '';
        //console.log(products);
        products.forEach(products => {
        let option = products.options;
        let vendor = products.vendor;
        if(products.vendor=="Gap"){
        result +=
`       
        <!-- single product-->
        <article class="product">
          <div class="img-container">
            <img
              src=${products.image_src}
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${products.id}>
              <i class="fas fa-shopping-cart">add to cart</i>
            </button>
            <div class="size-option">
            `;
              option.forEach(optionItem =>{
            let optionValue = optionItem.value;
            //console.log(optionValue);
            result +=
            `
            </button>
             <button class="size-btn" data-id=${products.id}>
              <i class="size">${optionValue}</i>
            </button>`;
            });
            result +=
            `
            </div>
          </div>
          <h3>${products.name}</h3>
          <h4>$${products.price}</h4>
        </article>
        <!-- end of products-->
        `;
        }
   });
    productsDOM.innerHTML = result;
   //console.log(result);
});

}
}

//local storage
class Storage{

    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        //console.log(products);
        
    return products.find(product => product.id == id);
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

document.addEventListener("DOMContentLoaded", ()=>{

    const ui = new UI();
    const products = new Products();

    //setup app
    ui.setupAPP();

    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        ui.applyFilter(products);
        Storage.saveProducts(products);
        
    }).then(()=>{
        ui.getBagButtons();
    });

   
});
