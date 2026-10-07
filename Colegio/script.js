const CONFIG={
  whatsapp:"18090000000", // CAMBIA ESTO POR TU NÚMERO REAL, SIN +
  instagram:"https://instagram.com/tu_instagram",
  currency:"$"
};

let cart=JSON.parse(localStorage.getItem("blissCart"))||[];

const navbar=document.getElementById("navbar");
if(navbar) window.addEventListener("scroll",()=>navbar.classList.toggle("scrolled",scrollY>10));

const menuToggle=document.getElementById("menuToggle"), mobileNav=document.getElementById("mobileNav");
if(menuToggle) menuToggle.addEventListener("click",()=>{
  const open=mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",open);
  menuToggle.textContent=open?"×":"☰";
});
document.querySelectorAll(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>{
  mobileNav?.classList.remove("open"); if(menuToggle){menuToggle.textContent="☰";menuToggle.setAttribute("aria-expanded","false")}
}));

const cartButton=document.getElementById("cartButton"),cartPanel=document.getElementById("cartPanel"),cartOverlay=document.getElementById("cartOverlay"),closeCart=document.getElementById("closeCart");
function openCart(){cartPanel?.classList.add("open");cartOverlay?.classList.add("open");document.body.style.overflow="hidden"}
function closeCartPanel(){cartPanel?.classList.remove("open");cartOverlay?.classList.remove("open");document.body.style.overflow=""}
cartButton?.addEventListener("click",openCart);closeCart?.addEventListener("click",closeCartPanel);cartOverlay?.addEventListener("click",closeCartPanel);

function money(n){return CONFIG.currency+Number(n).toLocaleString("en-US")}
function saveCart(){localStorage.setItem("blissCart",JSON.stringify(cart))}
function addToCart(name,price){
 const x=cart.find(i=>i.name===name); x?x.quantity++:cart.push({name,price:Number(price),quantity:1});
 saveCart();renderCart();showToast("Agregado al carrito");openCart();
}
document.querySelectorAll("[data-name][data-price]").forEach(b=>b.addEventListener("click",()=>addToCart(b.dataset.name,b.dataset.price)));

function changeQuantity(i,d){cart[i].quantity+=d;if(cart[i].quantity<=0)cart.splice(i,1);saveCart();renderCart()}
function removeItem(i){cart.splice(i,1);saveCart();renderCart()}
function renderCart(){
 const count=cart.reduce((s,i)=>s+i.quantity,0),total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
 const countEl=document.getElementById("cartCount"),totalEl=document.getElementById("cartTotal"),itemsEl=document.getElementById("cartItems");
 if(countEl)countEl.textContent=count;if(totalEl)totalEl.textContent=money(total);if(!itemsEl)return;
 if(!cart.length){itemsEl.innerHTML='<div class="empty-cart"><span>♡</span><p>Tu carrito está vacío.</p><small>Agrega algo rico para empezar.</small></div>';return}
 itemsEl.innerHTML=cart.map((i,n)=>`<div class="cart-item"><div><h4>${escapeHTML(i.name)}</h4><p>${money(i.price)} cada uno</p><div class="qty"><button onclick="changeQuantity(${n},-1)">−</button><span>${i.quantity}</span><button onclick="changeQuantity(${n},1)">+</button></div><button class="remove-item" onclick="removeItem(${n})">Eliminar</button></div><div class="cart-item-price">${money(i.price*i.quantity)}</div></div>`).join("");
}
document.getElementById("clearCart")?.addEventListener("click",()=>{cart=[];saveCart();renderCart()});
document.getElementById("checkoutButton")?.addEventListener("click",()=>{
 if(!cart.length){showToast("Tu carrito está vacío");return}
 const lines=cart.map(i=>`• ${i.name} x${i.quantity} — ${money(i.price*i.quantity)}`).join("\n");
 const total=cart.reduce((s,i)=>s+i.price*i.quantity,0);
 openWhatsApp(`Hola, The Bliss Spot ♡\n\nQuiero realizar este pedido:\n${lines}\n\nTotal: ${money(total)}\n\n¿Podemos confirmar disponibilidad?`);
});

function openWhatsApp(message){
 const number=CONFIG.whatsapp.replace(/\D/g,"");
 if(!number||number==="18098580375"){alert("Coloca tu número real de WhatsApp en CONFIG dentro de script.js.");return}
 window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
}
document.getElementById("floatingWhatsapp")?.addEventListener("click",e=>{e.preventDefault();openWhatsApp("Hola, The Bliss Spot ♡. Me gustaría realizar un pedido.")});
const ig=document.getElementById("instagramLink");if(ig){ig.href=CONFIG.instagram;ig.target="_blank";ig.rel="noopener noreferrer"}
document.getElementById("whatsappLink")?.addEventListener("click",e=>{e.preventDefault();openWhatsApp("Hola, The Bliss Spot ♡. Me gustaría conocer el menú.")});

const form=document.getElementById("orderForm");
if(form){
 const date=document.getElementById("orderDate"),d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());if(date)date.min=d.toISOString().split("T")[0];
 form.addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("customerName").value.trim(),phone=document.getElementById("customerPhone").value.trim(),product=document.getElementById("orderProduct").value,qty=document.getElementById("orderQuantity").value,dateVal=date.value,delivery=document.getElementById("delivery").value,notes=document.getElementById("notes").value.trim();
  const formatted=new Date(`${dateVal}T12:00:00`).toLocaleDateString("es-DO",{day:"2-digit",month:"long",year:"numeric"});
  openWhatsApp(`Hola, The Bliss Spot ♡\n\nQuiero hacer un pedido:\n\nNombre: ${name}\nTeléfono: ${phone}\nProducto: ${product}\nCantidad: ${qty}\nFecha: ${formatted}\nMétodo de entrega: ${delivery}\n${notes?`Notas: ${notes}`:""}`);
  showToast("Abriendo WhatsApp...");
 });
}
function showToast(message){const t=document.getElementById("toast");if(!t)return;t.querySelector("p").textContent=message;t.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove("show"),2300)}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
renderCart();
