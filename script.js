const btnSearch = document.querySelector('.header__btn__search');
const cartButton = document.querySelector('.header__button__card');
const containerCartItems = document.querySelector('.container__cart__items');
const containerItems = document.querySelector('.container__items');
const inputItens = document.querySelector('.input__itens');
const itemsList = document.querySelector('.items__list');
const emptierCart = document.querySelector('.emptier__cart');
const numberItem = document.querySelector('.number__item');
const itemPrice = document.querySelector('.price');

/* Botão de pesquisa  */
const clickBtnSearch = () => {
  if(inputItens.value != '') {
    const valueInputItens = inputItens.value;
    createArrObjectItem(valueInputItens);
  }
}

btnSearch.addEventListener('click', clickBtnSearch);
document.addEventListener('keydown', (event) => {
  const key = event.keyCode;
  if (key === 13) {
    clickBtnSearch();
  }
});

/* Botão delete carrinho */
emptierCart.addEventListener('click', () => {
  itemPrice.innerHTML = "0.00";
  itemsList.innerHTML = '';
  numberItem.innerHTML = 0;
});

/* Botão do carrinho cabaçalho */
const viewCart = () => {
  if (containerCartItems.classList == 'see__cart') {
    containerCartItems.classList.remove();
    containerCartItems.classList = 'cart';
  } else {
    containerCartItems.classList = 'see__cart';
  }
}

cartButton.addEventListener('click', viewCart);

/* Fazendo a requisição fetch */
const fetchItem = (value) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${value}`;
  const promise = fetch(url).then((response) => response.json())
  return promise;
}

/* Criando a imagem do item */
const createImgItem = (img) => {
  const imgItem = document.createElement('img');
  imgItem.src = img;
  imgItem.classList = 'img__item';
  return imgItem;
}

/* Criando span do id do item */
const createSpanIdItem = (id) => {
  const spanNameItem = document.createElement('span');
  spanNameItem.innerText = id;
  spanNameItem.classList = 'span__id__item';
  return spanNameItem;
}

/* Criando span do nome do item */
const createSpanNameItem = (name) => {
  const spanNameItem = document.createElement('span');
  spanNameItem.innerText = name;
  spanNameItem.classList = 'span__name__item';
  return spanNameItem;
}

/* Criando span do price do item */
const createSpanPriceItem = (price) => {
  const spanPriceItem = document.createElement('span');
  spanPriceItem.innerText = `R$ ${price.toString().replace('.', ',')}`;
  spanPriceItem.classList = 'span__price__item';
  return spanPriceItem;
}

/* Criando imagem do cart item */
const createImgItemCart = (img) => {
  const imgCart = document.createElement('img');
  imgCart.src = img;
  imgCart.classList = 'img__cart';
  return imgCart;
}

/* Criando span do cart intem */
const createSpanItemCart = (name, price) => {
  const imgCart = document.createElement('span');
  imgCart.innerText = `${name} | R$ ${price}`;
  imgCart.classList = 'span__cart';
  return imgCart;
}

const sumPriceItem = (price) => {
  let value = parseFloat(itemPrice.innerHTML);
  value = value + price;
  itemPrice.innerHTML = value.toFixed(2);
}

const decreasePriceItem = (price) => {
  let value = parseFloat(itemPrice.innerHTML);
  value = value - price;
  itemPrice.innerHTML = value.toFixed(2);
}

/* Criando o item do cart item */
const createItemCart = ({ thumbnail: img, title: name, price }) => {
  const liCartItem = document.createElement('li');
  liCartItem.addEventListener('click', () => {
    decreasePriceItem(price);
    liCartItem.remove();
    const num = parseInt(numberItem.innerHTML) - 1;
    numberItem.innerHTML = num;
  });
  liCartItem.appendChild(createImgItemCart(img));
  liCartItem.appendChild(createSpanItemCart(name, price));
  liCartItem.className = 'li__cart__item';
  sumPriceItem(price);
  itemsList.appendChild(liCartItem);
}

/* Requisição fetch cart items  */
const fetchItemCart = (idItens) => {
  const url = `https://api.mercadolibre.com/items/${idItens}`;
  fetch(url).then((promese) => promese.json())
    .then(data => createItemCart(data));
}

/* Criando botão do item */
const clickButtonItem = () => {
  const num = parseInt(numberItem.innerHTML) + 1
  numberItem.innerHTML = num;
  const idItens = event.target
    .parentNode
    .firstChild
    .innerText;
  fetchItemCart(idItens);
}

const createButtonItem = () => {
  const buttonItem = document.createElement('button');
  buttonItem.addEventListener('click', clickButtonItem);
  buttonItem.innerText = 'Adicionar ao Carrinho';
  buttonItem.classList = 'button__item';
  return buttonItem;
}

/* Criando um item com o objeto */
const createItem = (obj) => {
  const divItem = document.createElement('div');
  divItem.classList = 'item';
  divItem.appendChild(createSpanIdItem(obj.id));
  divItem.appendChild(createSpanNameItem(obj.name));
  divItem.appendChild(createImgItem(obj.image));
  divItem.appendChild(createSpanPriceItem(obj.price));
  divItem.appendChild(createButtonItem());
  containerItems.appendChild(divItem);
}

/* Criando um array de objeto com a resposta do fetch */
const createArrObjectItem = async (value) => {
  containerItems.innerText = '';
  const responseFetch = await fetchItem(value);
  const arrObjectItem = responseFetch.results.map((element) => ({
    id: element.id,
    name: element.title,
    image: element.thumbnail,
    price: element.price
  }));
  arrObjectItem.forEach(element => createItem(element));
}

window.onload = () => {
  createArrObjectItem();
}
