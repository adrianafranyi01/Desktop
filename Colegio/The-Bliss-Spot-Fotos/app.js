// ========================================
// MENÚ DESPLEGABLE
// ========================================

const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

if (menuBtn && menu) {

    menuBtn.addEventListener("click", () => {

        menu.classList.toggle("mostrar");

    });

}


// ========================================
// GALERÍA INTERACTIVA
// ========================================

const imagenPrincipal = document.getElementById("imagenPrincipal");
const miniaturas = document.querySelectorAll(".miniatura");

if (imagenPrincipal && miniaturas.length > 0) {

    miniaturas.forEach((miniatura) => {

        miniatura.addEventListener("click", () => {

            imagenPrincipal.src = miniatura.src;
            imagenPrincipal.alt = miniatura.alt;

        });

    });

}