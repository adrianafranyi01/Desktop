/* ==========================================================
   THE BLISS SPOT — DATOS EDITABLES
   Este es el ÚNICO archivo que necesitas tocar para cambiar
   el WhatsApp, tus redes, los productos, los precios y las fotos.
   Guarda el archivo y la página se actualiza sola (Live Server).
   ========================================================== */

window.BLISS_CONFIG = {
  nombre: "The Bliss Spot",

  // 1) WHATSAPP — número con código de país, SOLO dígitos (sin +, espacios ni guiones).
  //    Ejemplo: "573001234567". Mientras esté vacío, WhatsApp te dejará elegir
  //    a qué contacto enviar el pedido.
  whatsapp: "18098580375",

  // 2) REDES Y CONTACTO — déjalos vacíos ("") hasta tener los datos reales.
  instagramUrl: "",          // Ejemplo: "https://www.instagram.com/tu_usuario"
  instagramUsuario: "",      // Ejemplo: "@tu_usuario"
  correo: "",                // Ejemplo: "hola@tucorreo.com"
  ubicacion: "",             // Ejemplo: "Ciudad, barrio o zona de entrega"

  // 3) MONEDA (símbolo que aparece antes de cada precio)
  moneda: "$",

  // 4) Mientras los precios sean de ejemplo, se muestra un aviso en el menú.
  //    Cuando pongas tus precios reales, cambia esto a false.
  avisoPreciosEjemplo: false
};

/* Categorías del menú. Puedes cambiar el nombre, la descripción y la imagen. */
window.BLISS_CATEGORIES = [
  { id: "donas",     nombre: "Mini donas", descripcion: "Pequeñas, suaves y hechas en casa.",              img: "img/productos/portada-donas.jpg" },
  { id: "pasteles",  nombre: "Pasteles",   descripcion: "Pasteles sencillos para acompañar tus momentos.",  img: "img/productos/portada-pasteles.jpg" },
  { id: "flanes",    nombre: "Flanes",     descripcion: "Flanes caseros con caramelo.",                     img: "img/productos/portada-flanes.jpg" },
  { id: "brownies",  nombre: "Brownies",   descripcion: "Brownies caseros de chocolate.",                   img: "img/productos/portada-brownies.jpg" }
];

/* PRODUCTOS
   - id:        nombre único, sin espacios ni tildes (no lo repitas).
   - categoria: donas | pasteles | flanes | brownies
   - precio:    solo número (por ejemplo 12.5). Los que dicen ejemplo:true son PRECIOS DE EJEMPLO.
   - img:       ruta de la foto. Para usar tu foto, ponla en img/productos/ y cambia esta ruta.
   - ejemplo:   true = muestra "Precio de ejemplo"; cámbialo a false cuando pongas tu precio real.
   - destacado: true = aparece en "Favoritos" de la página de inicio.
   Para agregar un producto nuevo copia un bloque completo (entre llaves) y cámbiale los datos.
   Para quitar uno, bórralo o ponle // adelante. */
window.BLISS_PRODUCTS = [
  { id: "mini-donas-glaseadas", categoria: "donas", nombre: "Mini donas glaseadas",
    descripcion: "Mini donas con glaseado suave y un toque de decoración.",
    precio: 8, img: "img/productos/mini-donas-glaseadas.jpg", ejemplo: true, destacado: true },
  { id: "mini-donas-chispas", categoria: "donas", nombre: "Mini donas con chispas",
    descripcion: "Mini donas coloridas, ideales para compartir.",
    precio: 9, img: "img/productos/mini-donas-chispas.jpg", ejemplo: true, destacado: false },

  { id: "pastel-vainilla", categoria: "pasteles", nombre: "Pastel sencillo de vainilla",
    descripcion: "Pastel casero, esponjoso y con cobertura cremosa.",
    precio: 15, img: "img/productos/pastel-vainilla.jpg", ejemplo: true, destacado: true },
  { id: "pastel-chocolate", categoria: "pasteles", nombre: "Pastel sencillo de chocolate",
    descripcion: "Pastel casero de chocolate con cobertura suave.",
    precio: 16, img: "img/productos/pastel-chocolate.jpg", ejemplo: true, destacado: false },

  { id: "flan-casero", categoria: "flanes", nombre: "Flan casero",
    descripcion: "Flan cremoso con caramelo, hecho en casa.",
    precio: 4, img: "img/productos/flan-casero.jpg", ejemplo: true, destacado: true },
  { id: "choco-flan", categoria: "flanes", nombre: "Choco flan",
    descripcion: "Flan cremoso con caramelo sobre una base de bizcocho de chocolate.",
    precio: 14, img: "img/productos/choco-flan.jpg", ejemplo: true, destacado: false },

  { id: "brownie-casero", categoria: "brownies", nombre: "Brownie casero",
    descripcion: "Brownie de chocolate, húmedo y hecho en casa.",
    precio: 5, img: "img/productos/brownie-casero.jpg", ejemplo: true, destacado: true },
  { id: "brownie-cobertura", categoria: "brownies", nombre: "Brownie con cobertura",
    descripcion: "Brownie casero con una cobertura dulce por encima.",
    precio: 6, img: "img/productos/brownie-cobertura.jpg", ejemplo: true, destacado: false }
];
