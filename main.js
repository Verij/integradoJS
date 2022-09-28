//Llamado de los elementos
  //llamo a menu__carrito que va a ser usado para renderizar los productos en el carro
const menuCarrito = document.getElementById("menu__carrito");
const carritoLogo = document.getElementById("carrito__logo");
const hamburguesa = document.querySelector(".hamburguesa");
const navIzquierda = document.querySelector(".navbar__izquierda");
const navDerecha = document.querySelector(".navbar__derecha");
const selec = document.getElementById("seleccion__categorias");
const cardsContenedor = document.querySelector(".cards__contenedor");
const cardProducto = document.querySelector(".card__producto");
const contenedorRenderizadoCarrito = document.querySelector(".contenedor__renderizado__carrito");
const btnComprar = document.querySelector(".boton__compra");
const numeroCarrito = document.querySelectorAll('.numero__carrito');
const totalNumero = document.querySelector(".total__numero");
//para renderizar el producto



const renderizarProducto = producto => {
    const {
        id,
        nombre,
        origen,
        descripcion,
        precio,
        imagen,
    } = producto;
    return `
     <div class="card__producto">
          <div class="card__img">
            <img
              src="${imagen}"
            />
          </div>
          <div class="card__info">
            <div class="card__texto">
              <h1>${nombre}</h1>
              <h2 class="origen">Origen:${origen}</h2>
              <p>${descripcion}
              </p>
            </div>
            <div class="card__precio__btn">
              <p><span>${precio}</span>$</p>
              <button class="agregarBtn" 
              data-id='${id}'
              data-nombre='${nombre}'
              data-precio='${precio}'
              data-imagen='${imagen}'>Agregar</button>
            </div>
          </div>
        </div>
    `;
};



//Funcion para filtrar


function filtrar () {
const seleccionValor = seleccion__categorias.value;
const seleccionArray = [];

    //voy a recorrer el array de objetos con el forEach y cada vez que se cumpla los meto en el array SeleccionArray
    coctelesArray.forEach(producto => {
 if(seleccionValor===producto.tipo){
   seleccionArray.push(producto)
  return;

 }
})

  // funciona, ahora solo falta renderizar lo que haya dentro de seleccionArray. Una vez que termina de buscar todos los que se cumplan con el if, se renderiza llamando a la funcion renderizarFiltrado
  renderizarFiltrado(seleccionArray);
};

//Esta funcion verifica primero si la categoria seleccionada es todos, si es asi entonces va a mapear y renderizar coctelesArray que es lo de adentro de data.js. Si el valor no es todos, entonces va a renderizar los valores entrados por el parametro x (seleccionArray) que cumplan el if de la funcion filtrar



function renderizarFiltrado(x) {
     if (seleccion__categorias.value === 'todos') {
      cardsContenedor.innerHTML = coctelesArray.map(renderizarProducto).join('');
       return;
   }
  cardsContenedor.innerHTML = x.map(renderizarProducto).join('');
};


//funcion para hacer aparecer el carrito
function toggleCarrito(e) {
  
  if (menuCarrito.style.display === "none") {
    menuCarrito.style.display = "block";
    navDerecha.style.borderColor = "var(--corp-azulO)";
    navIzquierda.classList.remove("active");
    
  } else {
       //para que si esta abierto, y queres cerrarlo no te mande arriba. Pero si esta cerrado, que te mande arriba cuando lo abris para poder ver lo que compras
    e.preventDefault();
    menuCarrito.style.display = "none";
    navDerecha.style.borderColor = "white";
  }
}



 //funcion que activa el menu hamburguesa, y si esta abierto que esconda el carrito
function toggleHamburguesa (){
   navIzquierda.classList.toggle("active");
   menuCarrito.style.display = "none";
 }






//Parte carrito

    //renderizado del producto al carrito

function renderizarCarroProducto (productoCarro) {


const {
        id,
        nombre,
        precio,
        imagen,
        cantidad,
} = productoCarro;

  return `
<li class="fijado">
              <button class="quitar__btn" data-id='${id}'><i class='fa fa-trash'></i></button>
              <div class="imagen__item-carrito">
              <img
                src="${imagen}"
              />
              </div>
              <div class="item__contenedor__derecha">
              <span class="item__nombre">${nombre}</span>
              <span class="item__precio">$${precio}</span>
                <div class="cantidad__contenedor">
                  <p>Cant:</p>
                  <button class="resta"
                    data-id='${id}'
                    data-cantidad='${cantidad}'>-</button>
                  <span class="item__cantidad">${cantidad}</span>
                  <button class="suma"
                    data-id='${id}'
                    data-cantidad='${cantidad}'>+</button>
                </div>
                </div>
            </li>
    `;

}

  //agregar al carro

//Quiero guardar los datos al clickear los botones de las cards en el local storage, para despues tomarlos y renderizarlos de ahi

  //hacemos el local storage
  let carro = JSON.parse(localStorage.getItem('carro')) || [];
const saveLocalStorage = carroLista => {
  localStorage.setItem('carro', JSON.stringify(carroLista));
};



 //empiezo con la funcion para agregar los productos al carro al hacer click en el boton agregar

const agregarProducto = (e) => {
  if(!e.target.classList.contains('agregarBtn')) return;
  const productoCarro = {
    id: e.target.dataset.id,
    nombre: e.target.dataset.nombre,
    precio: e.target.dataset.precio,
    imagen: e.target.dataset.imagen,
  }

  //constante para que busque si existe en el carrito
const existeEnCarro = carro.find(productoBuscado => productoBuscado.id === productoCarro.id);
  //Si no existe el producto buscado en el carro, entonces le agrego el elemento cantidad y que este sea igual a 1. Una vez que tengo ahora cantidad como elemento de ese producto, lo empujo al array de carro.
  if(!existeEnCarro){
   productoCarro.cantidad = 1;
  carro.push(productoCarro);
  }
  //Si ya existe, entonces hago un map al carro y luego a cada item cada vez que le haga click a agregar producto que me sume 1 a esa cantidad. Lo que luego se va a renderizar en el carrito en la funcion renderizarCarroProducto.
  //tambien defino un numero como "stock" para que se detenga y no siga contando
if(existeEnCarro && existeEnCarro.cantidad < 10){
      carro = carro.map(item => {
    return item.id === productoCarro.id
     ? { ...item, cantidad: Number(item.cantidad) + 1 }
      : item;
   });
 }
menuCarrito.style.display = "block";
saveLocalStorage(carro);
renderizarCarro(carro);
montoTotal(carro);
 }





//Funcion para renderizar en carrito
const renderizarCarro = (listaCarrito) =>{
    
    if(!listaCarrito.length){
      //numero sube cada vez que se agrega un nuevo producto al carrito, y si no hay nada que renderize un p y el numero queda en 0
        numeroCarrito.forEach(elem => elem.innerHTML= `${0}`)
         btnComprar.classList.add('deshabilitar');
        contenedorRenderizadoCarrito.innerHTML = `<p class="vacio">No hay productos en el carro</p>`
        return;
    }
    btnComprar.classList.remove('deshabilitar');
    contenedorRenderizadoCarrito.innerHTML = listaCarrito.map(renderizarCarroProducto).join('')
    numeroCarrito.forEach(elem => elem.innerHTML= `${listaCarrito.length}`)
}


//Ahora trabajo sobre los botones + y - para sumar y restar cantidades que se quiera comprar

const cambioUnidades = e => {
   const existeEnCarro = carro.find(item => item.id === e.target.dataset.id);
  if (e.target.classList.contains('resta')) {
   

    if (existeEnCarro.cantidad > 1) {
      
    carro = carro.map(item => {
      return item.id === existeEnCarro.id
        ? { ...item, cantidad: Number(item.cantidad) - 1 }
        : item;
    })
    }
}
 if (e.target.classList.contains('suma')){
      
    if (existeEnCarro.cantidad < 10) {
      
    carro = carro.map(item => {
      return item.id === existeEnCarro.id
        ? { ...item, cantidad: Number(item.cantidad) + 1 }
        : item;
    })
    }
 }
saveLocalStorage(carro);
renderizarCarro(carro);
montoTotal(carro);
};

//funcion para quitar item del carrito
//quitar__btn

function removerItem(e) {
 if (e.target.classList.contains('quitar__btn')){
  const existingCartItem = carro.find(item => item.id === e.target.dataset.id);
  carro = carro.filter(item => item.id !== existingCartItem.id);
  saveLocalStorage(carro);
  renderizarCarro(carro);
  montoTotal(carro);
  return;
 }
 }

//hago la funcion que multiplique los precios con las cantidades

function montoTotal  (carroLista)  {
  totalNumero.innerHTML = `${carroLista
    .reduce((acc, cur) => acc + Number(cur.precio) * cur.cantidad, 0)
    } $`;
  };
  
//finalizamos la compra
const compraFinal = () => {
  if (window.confirm("¿Quiere finalizar la compra?")){
    contenedorRenderizadoCarrito.innerHTML=""
    localStorage.removeItem("carro")
    location.reload()
  }
}


  //llamo las funciones
function init() {
document.addEventListener('DOMContentLoaded', renderizarCarro(carro));
document.addEventListener('DOMContentLoaded', renderizarFiltrado(coctelesArray));
carritoLogo.addEventListener('click', toggleCarrito);
hamburguesa.addEventListener('click', toggleHamburguesa);
seleccion__categorias.addEventListener('change', filtrar);
cardsContenedor.addEventListener('click', agregarProducto);
contenedorRenderizadoCarrito.addEventListener('click', cambioUnidades);
contenedorRenderizadoCarrito.addEventListener('click', removerItem);
btnComprar.addEventListener("click",compraFinal);
montoTotal(carro);
}
init();
