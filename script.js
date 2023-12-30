const header = document.querySelector(".header");
const btnSearch = document.querySelector(".header__btn__search");
const cartButton = document.querySelector(".header__button__card");
const containerCartItems = document.querySelector(".container__cart__items");
const containerItems = document.querySelector(".container__items");
const inputItens = document.querySelector(".input__itens");
const itemsList = document.querySelector(".items__list");
const emptierCart = document.querySelector(".emptier__cart");
const headerButtonImg = document.querySelector(".header__button__img");
const itemPrice = document.querySelector(".price");

/* Botão de pesquisa  */
const clickBtnSearch = () => {
  if (inputItens.value != "") {
    const valueInputItens = inputItens.value;
    createArrObjectItem(valueInputItens);
  }
};

btnSearch.addEventListener("click", clickBtnSearch);
document.addEventListener("keydown", (event) => {
  const key = event.keyCode;
  if (key === 13) {
    clickBtnSearch();
  }
});

/* Botão delete carrinho */
emptierCart.addEventListener("click", () => {
  itemPrice.innerHTML = "0.00";
  itemsList.innerHTML = "";
  headerButtonImg.src = "./image/supermarket-cart.png";
});

/* Botão do carrinho cabaçalho */
cartButton.addEventListener("click", () => {
  containerCartItems.classList.toggle("cart");
});

containerItems.addEventListener("click", () => {
  containerCartItems.classList = "container__cart__items cart see__cart";
});

/* Fazendo a requisição fetch */
const fetchItem = (value) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${value}`;
  const promise = fetch(url).then((response) => response.json());
  return promise;
};

/* Criando a imagem do item */
const createImgItem = (img) => {
  const imgItem = document.createElement("img");
  imgItem.src = img;
  imgItem.classList = "img__item";
  return imgItem;
};

/* Criando span do id do item */
const createSpanIdItem = (id) => {
  const spanNameItem = document.createElement("span");
  spanNameItem.innerText = id;
  spanNameItem.classList = "span__id__item";
  return spanNameItem;
};

/* Criando span do nome do item */
const createSpanNameItem = (name) => {
  const spanNameItem = document.createElement("span");
  spanNameItem.innerText = name;
  spanNameItem.classList = "span__name__item";
  return spanNameItem;
};

/* Criando span do price do item */
const createSpanPriceItem = (price) => {
  const spanPriceItem = document.createElement("span");
  spanPriceItem.innerText = `R$ ${price.toString().replace(".", ",")}`;
  spanPriceItem.classList = "span__price__item";
  return spanPriceItem;
};

/* Criando imagem do cart item */
const createImgItemCart = (img) => {
  const imgCart = document.createElement("img");
  imgCart.src = img;
  imgCart.classList = "img__cart";
  return imgCart;
};

/* Criando span do cart intem */
const createSpanItemCart = (name, price) => {
  const imgCart = document.createElement("span");
  imgCart.innerText = `${name} | R$ ${price}`;
  imgCart.classList = "span__cart";
  return imgCart;
};

/* Somando os preços do carrinho */
const sumPriceItem = (price) => {
  let value = parseFloat(itemPrice.innerHTML);
  value = value + price;
  itemPrice.innerHTML = value.toFixed(2);
};

/* Subtraindo os preços do carrinho */
const decreasePriceItem = (price) => {
  let value = parseFloat(itemPrice.innerHTML);
  value = value - price;
  itemPrice.innerHTML = value.toFixed(2);
};

/* Criando o item do cart item */
const createItemCart = ({ thumbnail: img, title: name, price }) => {
  const liCartItem = document.createElement("li");
  liCartItem.addEventListener("click", () => {
    decreasePriceItem(price);
    liCartItem.remove();
    const liCartItemArr = document.querySelectorAll(".li__cart__item");
    if (liCartItemArr.length === 0) {
      headerButtonImg.src = "./image/supermarket-cart.png";
    }
  });
  liCartItem.appendChild(createImgItemCart(img));
  liCartItem.appendChild(createSpanItemCart(name, price));
  liCartItem.className = "li__cart__item";
  sumPriceItem(price);
  itemsList.appendChild(liCartItem);
};

/* Requisição fetch cart items  */
const fetchItemCart = (idItens) => {
  const url = `https://api.mercadolibre.com/items/${idItens}`;
  fetch(url)
    .then((promese) => promese.json())
    .then((data) => createItemCart(data));
};

/* Criando botão do item */
const clickButtonItem = () => {
  headerButtonImg.src = "./image/supermarket-cart2.png";
  const idItens = event.target.parentNode.firstChild.innerText;
  fetchItemCart(idItens);
};

const createButtonItem = () => {
  const buttonItem = document.createElement("button");
  buttonItem.addEventListener("click", clickButtonItem);
  buttonItem.innerText = "Adicionar ao Carrinho";
  buttonItem.classList = "button__item";
  return buttonItem;
};

/* Criando um item com o objeto */
const createItem = (obj) => {
  const divItem = document.createElement("div");
  divItem.classList = "item";
  divItem.appendChild(createSpanIdItem(obj.id));
  divItem.appendChild(createSpanNameItem(obj.name));
  divItem.appendChild(createImgItem(obj.image));
  divItem.appendChild(createSpanPriceItem(obj.price));
  divItem.appendChild(createButtonItem());
  containerItems.appendChild(divItem);
};

const loadingItems = () => {
  const imgGif = document.createElement("img");
  imgGif.classList = "loading";
  imgGif.src = "./image/carregando.gif";
  containerItems.appendChild(imgGif);
};

/* Criando um array de objeto com a resposta do fetch */
const createArrObjectItem = async (value) => {
  containerItems.innerText = "";
  loadingItems();
  const responseFetch = await fetchItem(value);
  const arrObjectItem = responseFetch.results.map((element) => ({
    id: element.id,
    name: element.title,
    image: element.thumbnail,
    price: element.price,
  }));
  setTimeout(() => {
    document.querySelector(".loading").remove();
    arrObjectItem.forEach((element) => createItem(element));
  }, "1000");
};

window.onload = () => {
  createArrObjectItem();
};
