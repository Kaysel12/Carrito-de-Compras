// Cartas / Items
const cards = document.querySelector(".cards");
const templateCard = document.getElementById("template-card").content;

// Canasta
const items = document.querySelector('.maquetado-canasta');
const templateItems = document.getElementById('template-items').content;

// Footer
const footer = document.querySelector('.footer');
const templateFooter = document.getElementById('template-footer').content;


let fragment = new DocumentFragment()
let carrito = {}

// Ejemplo de lo que se hara con el carrito
// let carrito = {
//     producto:{
//         michael: "abreu"
//     }
// }
// console.log(carrito["producto"].michael)//abreu


// Cada vez que se cargue el documento HTML por completo, se cargaran los datos json
document.addEventListener("DOMContentLoaded", () => {
    datosFetch()
})


// -----------------------------------------------------------------
// Datos del fecth
const datosFetch = async () => {
    try {
        let res = await fetch("data.json");
        let data = await res.json();
        // console.log(data);
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// Funcion para pintar los productos con templates
const pintarCards = (data) => {
    data.forEach(productos => {
        // console.log(productos);
        templateCard.querySelector('h3').textContent = productos.title
        templateCard.querySelector('p').textContent = productos.precio
        templateCard.querySelector('img').setAttribute("src", productos.findImage)
        templateCard.querySelector('.btn-comprar').dataset.id = productos.id


        let clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })

    cards.appendChild(fragment)
}
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// Funcion para agregar los objetos al carrito, creando un objeto vacio, mas arriba, llamado "CARRITO".
cards.addEventListener("click", e => {
    addCarrito(e)
})

const addCarrito = (evt) => {
    if (evt.target.classList.contains("btn-comprar")) {
        setCarrito(evt.target.parentNode)
    }
    evt.stopPropagation()
}

// creamos una nueva funcion que pasara a llamar el PARENTNODE del boton "comprar"
const setCarrito = objectParent => {
    // console.log(objectParent)
    const producto = {
        id: objectParent.querySelector('.btn-comprar').dataset.id,
        titulo: objectParent.querySelector('h3').textContent,
        precio: objectParent.querySelector('p').textContent,
        cantidad: 1
    }

    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    // Con esto agregamos un index (1:, 2:...) con su propia copia de producto.
    // Producto.id es como pusimos cada index del carrito

    carrito[producto.id] = producto
    pintarCarrito()
    totales()
}
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// Vamos a pintar los items en la seccion de canasta
const pintarCarrito = ()=>{
    // console.log(carrito)
    Object.values(carrito).forEach(producto =>{
        // console.log(producto.id)
        items.textContent = ""
        templateItems.querySelectorAll('p')[0].textContent = producto.id;
        templateItems.querySelectorAll('p')[1].textContent = producto.titulo;
        templateItems.querySelectorAll('p')[2].textContent = producto.cantidad;
        templateItems.querySelector(".btn-sum").dataset.id = producto.id;
        templateItems.querySelector(".btn-res").dataset.id = producto.id;
        templateItems.querySelectorAll('p')[3].textContent = producto.precio * producto.cantidad;
        
        let clone = templateItems.cloneNode(true);
        fragment.appendChild(clone);
    })
    items.appendChild(fragment)
    // let clone = templateItems.cloneNode(true);
    // fragment.appendChild(clone)
    totales()
}
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// Crear funcion para el footer
const totales = ()=>{

    footer.textContent = ""
    if (Object.values(carrito) == 0) {
        items.innerHTML = ""
        footer.innerHTML = `
        <b>En este momento el carrito esta vacio</b>
        `
        return //Se usa para que cuando sea true, el return cierre aqui
    }

    // Este ejecucion la usamos para aumentar valores dinamicamente
    let nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad ,0)
    let nPrecios = Object.values(carrito).reduce((acc, {precio, cantidad}) => acc + precio*cantidad ,0)

    templateFooter.querySelectorAll('h4')[1].textContent = nCantidad;
    templateFooter.querySelectorAll('h4')[2].textContent = nPrecios;

    let clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    let btnVaciar = document.querySelector('.btn-vaciar');
    btnVaciar.addEventListener('click', ()=>{
        carrito = {}
        pintarCarrito()
    })
}
// -----------------------------------------------------------------


// -----------------------------------------------------------------
// Crear funcion para identificar los botones y aumentar o disminuir la cantidad de carrito
items.addEventListener('click', e =>{
    btnItems(e)
})

const btnItems = e =>{
    // Accion de aumentar
    if(e.target.classList.contains('btn-sum')){
        // console.log(carrito[e.target.dataset.id])
        let producto = carrito[e.target.dataset.id];
        producto.cantidad++
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-res')){
        // console.log(carrito[e.target.dataset.id])
        let producto = carrito[e.target.dataset.id];
        producto.cantidad--
        pintarCarrito()

        if (producto.cantidad <= 0) {
            delete carrito[e.target.dataset.id]
            pintarCarrito()
        }
    }
}
// -----------------------------------------------------------------
