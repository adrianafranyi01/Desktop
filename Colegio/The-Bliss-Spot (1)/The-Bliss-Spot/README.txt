THE BLISS SPOT — Guía rápida del proyecto
==========================================

1) CÓMO ABRIRLO EN VISUAL STUDIO CODE
-------------------------------------
1. Descomprime la carpeta "The-Bliss-Spot".
2. En Visual Studio Code: Archivo > Abrir carpeta... y elige "The-Bliss-Spot".
3. Instala la extensión "Live Server" (de Ritwick Dey) si aún no la tienes.
4. Haz clic derecho sobre index.html > "Open with Live Server".
5. Se abrirá en el navegador. Cada vez que guardes un archivo (Ctrl+S) se actualiza sola.
Nota: las tipografías (Fraunces y Jost) se cargan desde Google Fonts, así que necesitas internet
para verlas. Sin internet la página funciona con tipografías de respaldo.

2. ESTRUCTURA DE CARPETAS
-------------------------
The-Bliss-Spot/
├── index.html        Inicio
├── nosotros.html     Historia de la marca
├── menu.html         Menú con categorías, filtros y carrito
├── pedidos.html      Formulario de pedido (revisión + WhatsApp)
├── contacto.html     WhatsApp, Instagram, correo y ubicación
├── css/style.css     Todos los estilos (colores en la parte de arriba, en :root)
├── js/config.js      *** TUS DATOS: WhatsApp, redes, productos, precios, fotos ***
├── js/script.js      Funcionamiento (carrito, menú, formularios). No necesitas tocarlo
├── img/
│   ├── logo.svg, favicon.svg, hero.svg, nosotros.svg
│   └── productos/    Fotos de los postres
└── README.txt

3. QUÉ CAMBIAR Y DÓNDE (todo en js/config.js)
---------------------------------------------
A) NÚMERO DE WHATSAPP
   Busca:   whatsapp: "",
   Escribe: whatsapp: "573001234567",   (código de país + número, solo dígitos, sin + ni espacios)
   Mientras esté vacío, al enviar un pedido WhatsApp te deja elegir el contacto.

B) INSTAGRAM, CORREO Y UBICACIÓN
   instagramUrl:     "https://www.instagram.com/tu_usuario",
   instagramUsuario: "@tu_usuario",
   correo:           "hola@tucorreo.com",
   ubicacion:        "Tu zona o ciudad",
   Lo que dejes vacío aparece como "Próximamente" y el botón queda desactivado.

C) PRECIOS
   En cada producto, cambia el número de "precio:" (ejemplo: precio: 12.5).
   Luego cambia  ejemplo: true  por  ejemplo: false  para que desaparezca la etiqueta "Precio de ejemplo".
   Cuando todos sean reales, cambia avisoPreciosEjemplo: true por false (arriba del archivo).
   Moneda: cambia moneda: "$" por el símbolo que uses.

D) NOMBRES Y DESCRIPCIONES
   Cambia "nombre:" y "descripcion:" de cada producto. Los que hay son EJEMPLOS, no productos confirmados.

E) AGREGAR O QUITAR PRODUCTOS
   Copia un bloque completo { ... } de window.BLISS_PRODUCTS, pégalo, y cambia sus datos
   (el "id" debe ser único, sin espacios ni tildes; "categoria" debe ser donas, pasteles, flanes o brownies).
   Para quitar uno, bórralo.

4. CÓMO CAMBIAR LAS IMÁGENES
----------------------------
Las imágenes actuales (archivos .svg) son ilustraciones temporales. Para usar tus fotos:
1. Copia tu foto (mejor cuadrada, .jpg o .webp, unos 800 x 800 px) dentro de: img/productos/
2. En js/config.js, cambia la ruta del producto. Ejemplo:
      img: "img/productos/mini-donas-glaseadas.jpg"
   por  img: "img/productos/mis-mini-donas.jpg"
3. Las imágenes de las categorías (las 4 que aparecen en Inicio y en el menú) se cambian en
   window.BLISS_CATEGORIES, en el campo "img".
4. Imagen principal de Inicio: reemplaza img/hero.svg (o cambia el nombre en index.html, en la línea que dice src="img/hero.svg").
   Foto de Nosotros: img/nosotros.svg, en nosotros.html.
Consejo: si nombras tu foto igual que la ilustración (por ejemplo hero.jpg) recuerda cambiar la extensión también en el código.

5. CÓMO FUNCIONA EL PEDIDO
--------------------------
- El cliente agrega postres con "Agregar". El carrito se guarda en su navegador
  (sigue ahí si cambia de página o actualiza).
- "Finalizar pedido" lleva a pedidos.html, donde completa sus datos, revisa el pedido en una ventana
  y lo envía: se abre WhatsApp con el mensaje ya escrito (productos, cantidades y total).
- El cliente debe pulsar "Enviar" dentro de WhatsApp. No hay pagos en línea ni confirmación automática:
  tú confirmas el pedido por WhatsApp.
- No hay servidor: los pedidos NO se guardan en ningún sitio, llegan solo por WhatsApp.

6. PARA PUBLICARLA EN INTERNET (cuando quieras)
-----------------------------------------------
Sube toda la carpeta a un hosting estático (por ejemplo Netlify, GitHub Pages o Vercel).
No necesita base de datos ni servidor.

7. COLORES
----------
En css/style.css, al principio, están las variables de color (--cherry, --rose, --lilac, --gold, --cream).
Cambia el código de color y se actualiza toda la página.
