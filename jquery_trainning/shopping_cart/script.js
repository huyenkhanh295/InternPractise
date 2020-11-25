var shopping = {
  products: [
    {
      id: 1,
      name: 'name 1',
      price: 25.4,
      image:
        'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/66d8c25c-27cc-44ff-877e-35e5ce84a9c1/brasilia-jdi-backpack-QZMVk9.jpg',
      inCart: 22,
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
      alert(localStorage.getItem('productInCart'));
      
      let productList = JSON.parse(localStorage.getItem('productInCart'));
      console.log(productList);
      for(item of productList){
        index = this.getProductIndexById(parseInt(item.id));
        this.products[index].inCart = parseInt(item.inCart);
      }
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
      if(item.inCart < 20){
        // goi ham thay doi so luong cart
      }else{
        // disable cái button 
      }
    })
    // // let quantityInput = $("input[type|='text']");
    // $('input').keydown(function(event){
    //   if(isNaN(parseInt(event.key))) //|| quantityInput.val().chartAt(0) == "0"){
    //     alert('Please enter a valid number!')
    //   }
    // )
  },

  renderProduct() {
    for (item of this.products) {
      let divProdItem = $('<div></div>').addClass('product-item'),
        divProdImage = $('<div></div>').addClass('product-img'),
        imgProdImage = $('<img>').attr({
          src: `${item.image}`,
          alt: `${item.name}`,
          id: `${item.id}`
        }),
        btnAddToCart = $('<button></button>').text('Add To Cart').addClass('add-to-cart'),
        divProdInfo = $('<div></div>').addClass('product-info'),
        h3ProdName = $('<h3></h3>')
          .addClass('product-name')
          .text(`${item.name}`),
        pProdPrice = $('<p></p>')
          .addClass('product-price')
          .text(`$${item.price}`);

      $('.product-list').append(
        divProdItem
          .append(divProdImage.append(imgProdImage))
          .append(divProdInfo.append(h3ProdName).append(pProdPrice))
          .append(btnAddToCart)
      );
    }
  },

  renderCart() {
    for (item of this.products) {
      if (item.inCart > 0) {
        let row = $('<tr></tr>'),
          colName = $('<td></td>').text(`${item.name}`),
          colImg = $('<td></td>'),
          prodImg = $('<img>').attr('src', `${item.image}`),
          colPrice = $('<td></td').text(`$${item.price}`),
          colQuantity = $('<td></td>'),
          colTotal = $('<td></td>').text(`$${item.inCart*item.price}`),
          inputQuantity = $('<input>').attr({type: 'number', value: `${item.inCart}`, min: '1'}),
          btnIncrease = $('<button></button>').text('+').addClass('btn btn-increase'),
          btnDecrease = $('<button></button>').text('-').addClass('btn btn-decrease');
          colDelete = $('<td></td>');
          btnDelete = $('<button></button>').text('x').addClass('btn btn-delete');
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
  },

  updateCart() {},

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
