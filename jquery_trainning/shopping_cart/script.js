var shopping = {
  products: [
    {
      id: 1,
      name: 'name 1',
      price: 25.4,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/66d8c25c-27cc-44ff-877e-35e5ce84a9c1/brasilia-jdi-backpack-QZMVk9.jpg',
      inCart: 0,
    },
    {
      id: 2,
      name: 'name 2',
      price: 25,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/i1-c9c4a51d-5a6f-4753-9969-a4e0a3123a50/future-pro-backpack-K2tFp0.jpg',
      inCart: 0,
    },
    {
      id: 3,
      name: 'name 3',
      price: 46,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/96fbe5d0-1e0b-44aa-955f-4a49f766e514/printed-gymsack-LFD6ZR.jpg',
      inCart: 0,
    },
    {
      id: 4,
      name: 'name 4',
      price: 55,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8f7848e7-8242-4afe-8bab-1ebe6d10c20a/tanjun-printed-backpack-sjCVw1.jpg',
      inCart: 0,
    },
    {
      id: 5,
      name: 'name 5',
      price: 78,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e27f3e88-c35d-490a-8d3b-c83410b3fbb7/heritage-backpack-k0f58g.jpg',
      inCart: 0,
    },
    {
      id: 6,
      name: 'name 6',
      price: 47,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f530ca3e-1071-4672-9e1f-f8082b2474c8/heritage-tote-VlMdtS.jpg',
      inCart: 0,
    },
    {
      id: 7,
      name: 'name 7',
      price: 29,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f237b64b-6206-42f6-9762-8d504caa738f/lebron-utility-bag-75CJZR.jpg',
      inCart: 0,
    },
    {
      id: 8,
      name: 'name 8',
      price: 81,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/oixxif9s2hpi8798pfy3/tanjun-backpack-FC8qMk.jpg',
      inCart: 0,
    },
  ],
  max : 25,
  
  init() {
    this.renderProduct();
    this.addEvent();
    this.initLocalStorage();
    this.renderCart();
  },

  initLocalStorage() {
    if(!localStorage.getItem('productInCart')){
      let productInCart =[];
      for(item of this.products){
        if(item.inCart > 0){
          productInCart.push({id: `${item.id}`, inCart: `${item.inCart}`});
        }
      }
      localStorage.setItem('productInCart', JSON.stringify(productInCart));
    }else{
      let productList = JSON.parse(localStorage.getItem('productInCart'));
      console.log(productList);
      for(item of productList){
        index = this.getProductIndexById(parseInt(item.id));
        this.products[index].inCart = parseInt(item.inCart);
      }
      let totalPrice = 0;
      for(item of this.products){
        if(item.inCart > 0){
          totalPrice += item.inCart * item.price
        }
      }
      this.loadCart(totalPrice); 
    }
  },

  addEvent() {
    $('.cart').click(function(){
      $('.product-list').addClass('display-none');
      $('.table-cart').removeClass('display-none');
    });
    $('.home').click(function(){
      $('.table-cart').addClass('display-none');
      $('.product-list').removeClass('display-none');
    });
    $('.add-to-cart').click(function(){
      let item = shopping.getProduct($(this).attr('id'));
      if(item.inCart == 0){
        let productList = JSON.parse(localStorage.getItem('productInCart'));
        console.log(productList);

        productList.push({id: `${item.id}`, inCart: 1});
        
        localStorage.setItem('productInCart', JSON.stringify(productList));
        shopping.products[`${item.id - 1}`].inCart = 1;
      //ngay cho nay ko co tinh tien
      

        let total = parseFloat(localStorage.getItem('totalPrice')) + item.price ;
        shopping.loadCart(total);
        console.log(localStorage);

      }else if(item.inCart < shopping.max){
        shopping.changeProductQuantity($(this).attr('id'));
        // goi ham thay doi so luong cart
      }else{
        alert('This product quantity is maximum!');
        // disable cái button 
      }
    })
  },

  renderProduct() {
    for (item of this.products) {
      let divProdItem = $('<div></div>').addClass('product-item'),
        divProdImage = $('<div></div>').addClass('product-img'),
        imgProdImage = $('<img>').attr({
          src: `${item.image}`,
          alt: `${item.name}`          
        }),
        btnAddToCart = $('<button></button>').text('Add To Cart').addClass('add-to-cart').attr('id', `${item.id}`),
        divProdInfo = $('<div></div>').addClass('product-info'),
        h3ProdName = $('<h3></h3>')
          .addClass('product-name')
          .text(`${item.name}`),
        pProdPrice = $('<p></p>')
          .addClass('product-price')
          .text(`$${item.price.toFixed(2)}`);

      $('.product-list').append(
        divProdItem
          .append(divProdImage.append(imgProdImage))
          .append(divProdInfo.append(h3ProdName).append(pProdPrice))
          .append(btnAddToCart)
      );
    }
  },

  changeProductQuantity(id, quantity = 1){
    let item = this.getProduct(id),
    totalPrice = localStorage.getItem('totalPrice');

    total = parseFloat(totalPrice) + item.price * quantity;
    item.inCart += quantity;
    if(item.inCart == 0){
      // bo product ra localStorage
      let productList = JSON.parse(localStorage.getItem('productInCart'));
      for(let i =0; i<productList.length;i++){
        if(productList[i].id == id){
          productList.splice(i,1);
          console.log(productList);
          localStorage.setItem('productInCart', JSON.stringify(productList));
          break;
        }
      }
      console.log(localStorage.getItem('productInCart'));
    }
    this.products[id -1].inCart = item.inCart;
    
    this.loadCart(total.toFixed(2));
  },

  loadCart(totalPrice=0){
    console.log('local price' + localStorage.getItem('totalPrice'));
    localStorage.setItem('totalPrice', totalPrice);
    let countCart= JSON.parse(localStorage.getItem('productInCart')).length;
    localStorage.setItem('countCart', countCart);
    let count = $('.count-cart');
    count.empty();
    if(localStorage.getItem('countCart') > 100){
      count.text('99+');
    }else{
      count.text(localStorage.getItem('countCart'));
    }
    this.renderCart();
  },

  renderCart() {
    $(".product-in-cart").empty();
    for (item of this.products) {
      if (item.inCart > 0) {
        let row = $('<tr></tr>'),
          colName = $('<td></td>').text(`${item.name}`),
          colImg = $('<td></td>'),
          prodImg = $('<img>').attr({src: `${item.image}`}),
          colPrice = $('<td></td').text(`$${item.price.toFixed(2)}`),
          colQuantity = $('<td></td>'),
          colTotal = $('<td></td>').text(`$${(item.inCart*item.price).toFixed(2)}`),
          inputQuantity = $('<input>').attr({type: 'number', value: `${item.inCart}`, min: '1'}),
          btnIncrease = $('<button></button>').text('+').addClass('btn btn-increase').attr('id', `${item.id}`),
          btnDecrease = $('<button></button>').text('-').addClass('btn btn-decrease').attr('id', `${item.id}`),
          colDelete = $('<td></td>'),
          btnDelete = $('<button></button>').text('x').addClass('btn btn-delete').attr('id', `${item.id}`);
        $('.product-in-cart').append(
          row
            .append(colName)
            .append(colImg.append(prodImg))
            .append(colPrice)
            .append(colQuantity.append(btnDecrease).append(inputQuantity).append(btnIncrease))
            .append(colTotal)
            .append(colDelete.append(btnDelete))
        );
      }
    }
    $('.total-price').text('$' + parseFloat(localStorage.getItem('totalPrice')).toFixed(2) );
    this.addEventToCard();
  },

  addEventToCard(){
    $('.btn-decrease').click(function(){
      let product = shopping.getProduct($(this).attr('id'));
      if (product.inCart > 1){
        shopping.changeProductQuantity($(this).attr('id'), -1);
        // shopping.renderCart();
      }      
    });
    $('.btn-increase').click(function(){
      let product = shopping.getProduct($(this).attr('id'));
      if (product.inCart < shopping.max){
        shopping.changeProductQuantity($(this).attr('id'));
        // shopping.renderCart();
      }else{
        alert('product quantity is maximum~');
      }      
    });
    $('.btn-delete').click(function(){
      if(confirm('Do you want to delete this item?')){
        let product = shopping.getProduct($(this).attr('id'));
        shopping.changeProductQuantity($(this).attr('id'), -(product.inCart))
        // shopping.renderCart();
      }  
    });
  },

  getProduct(id){
    for(item of this.products)
      if(item.id == id) return item;
  },

  getProductIndexById(id){
    for(let i =0; i< this.products.length; i++){
      if(this.products[i].id == id){
        return i;
      }
    }
    return -1;
  }


};

$(function () {
  shopping.init();
});
