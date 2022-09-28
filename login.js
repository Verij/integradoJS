const navIzquierda = document.querySelector(".navbar__izquierda");
const hamburguesa = document.querySelector(".hamburguesa");

function toggleHamburguesa (){
   navIzquierda.classList.toggle("active");
 }

hamburguesa.addEventListener('click', toggleHamburguesa);