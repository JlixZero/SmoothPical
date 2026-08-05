const flavors = {
  maracumango: { name: "Maracumango", price: 10000 },
  mangoboom: { name: "MangoBoom", price: 10000 },
  lulo: { name: "Smoothie de Lulo", price: 10000 },
  guanabana: { name: "Guanábana con coco", price: 10000 },
  jugo: { name: "Jugo de Lulo", price: 5000 },
};

const formatCurrency = (value) => `$${value.toLocaleString("es-CO")}`;
const select = document.querySelector("#flavorSelect");
const quantityOutput = document.querySelector("#quantity");
const totalPrice = document.querySelector("#totalPrice");
const formStatus = document.querySelector("#formStatus");
let quantity = 1;

const storyFlavors = {
  maracumango: { label: "Maracumango", top: "#ffcf1b", bottom: "#f18712", accent: "#ef6da5" },
  mangoboom: { label: "MangoBoom", top: "#ffe783", bottom: "#ec9b20", accent: "#fb8e22" },
  lulo: { label: "Smoothie de Lulo", top: "#dfe267", bottom: "#92a832", accent: "#a4c13a" },
  guanabana: { label: "Guanábana con coco", top: "#fff9dd", bottom: "#ded1ad", accent: "#86a836" },
  jugo: { label: "Jugo de Lulo", top: "#ffc829", bottom: "#f07d14", accent: "#eba437" },
};

function updateOrder() {
  const flavor = flavors[select.value];
  totalPrice.textContent = formatCurrency(flavor.price * quantity);
  quantityOutput.value = quantity;
  quantityOutput.textContent = quantity;

  document.querySelectorAll(".flavor-card").forEach((card) => {
    const active = card.dataset.flavor === select.value;
    card.classList.toggle("is-selected", active);
    card.setAttribute("aria-pressed", String(active));
  });
}

function chooseFlavor(id, scrollToOrder = false) {
  if (!flavors[id]) return;
  select.value = id;
  formStatus.textContent = "";
  updateOrder();
  if (scrollToOrder) {
    document.querySelector("#pedido").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

document.querySelectorAll("[data-select]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    chooseFlavor(button.dataset.select, true);
  });
});

document.querySelectorAll(".flavor-card").forEach((card) => {
  card.addEventListener("click", () => chooseFlavor(card.dataset.flavor));
});

select.addEventListener("change", () => {
  formStatus.textContent = "";
  updateOrder();
});

document.querySelector("#increase").addEventListener("click", () => {
  quantity = Math.min(20, quantity + 1);
  updateOrder();
});

document.querySelector("#decrease").addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  updateOrder();
});

async function copyText(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const fallback = document.createElement("textarea");
  fallback.value = text;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "fixed";
  fallback.style.opacity = "0";
  document.body.appendChild(fallback);
  fallback.select();
  document.execCommand("copy");
  fallback.remove();
}

const WHATSAPP_NUMBER = "573503747623"; // +57 350 374 7623, sin "+" ni espacios (formato que exige wa.me)
const orderForm = document.querySelector("#orderForm");
let lastAction = "whatsapp";

// event.submitter no existe en algunos navegadores/webviews viejos, así que
// guardamos qué botón se presionó apenas se hace click, antes del submit.
orderForm.querySelectorAll("button[type='submit']").forEach((button) => {
  button.addEventListener("click", () => {
    lastAction = button.value || button.dataset.action || "whatsapp";
  });
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const action = event.submitter?.value || lastAction;

  const nameField = document.querySelector("#customerName");
  const name = nameField.value.trim();

  // No se deja continuar el pedido sin nombre (dato obligatorio del pedido).
  if (!name) {
    formStatus.textContent = "Escribe tu nombre para poder enviar el pedido.";
    nameField.focus();
    return;
  }

  const flavor = flavors[select.value];
  const notes = document.querySelector("#notes").value.trim() || "Sin notas";
  const order = [
    "🥤✨ ¡Nuevo pedido tropical para Smooth Pical!",
    `👤 Nombre: ${name}`,
    `🍹 Sabor: ${flavor.name}`,
    `🔢 Cantidad: ${quantity}`,
    `💰 Total: ${formatCurrency(flavor.price * quantity)}`,
    `📝 Notas: ${notes}`,
    "",
    "¡Gracias por elegir tu pausa favorita! 🌴🍍",
  ].join("\n");

  if (action === "whatsapp") {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(order)}`;
    window.open(url, "_blank", "noopener");
    formStatus.textContent = "Abrimos WhatsApp con tu pedido listo. Solo falta que le des enviar.";
    return;
  }

  try {
    await copyText(order);
    formStatus.textContent = "¡Pedido copiado! Ya puedes enviarlo al equipo Smooth Pical.";
  } catch {
    formStatus.textContent = "No se pudo copiar automáticamente. Inténtalo de nuevo.";
  }
});

const menuToggle = document.querySelector("#menuToggle");
const navigation = document.querySelector("#mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  menuToggle.classList.toggle("is-open", !isOpen);
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.classList.remove("is-open");
    navigation.classList.remove("is-open");
  });
});

const storyStage = document.querySelector("#storyStage");
const storyCurrent = document.querySelector("#storyCurrent");
const storySteps = document.querySelectorAll(".story-step");

function setStoryFlavor(id) {
  const flavor = storyFlavors[id];
  if (!flavor || !storyStage) return;

  storyStage.style.setProperty("--story-top", flavor.top);
  storyStage.style.setProperty("--story-bottom", flavor.bottom);
  storyStage.style.setProperty("--story-accent", flavor.accent);
  storyCurrent.textContent = flavor.label;
  storySteps.forEach((step) => step.classList.toggle("is-active", step.dataset.story === id));
}

function updateStoryMotion() {
  if (!storyStage || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const section = storyStage.closest(".flavor-story");
  if (!section) return;
  const rect = section.getBoundingClientRect();
  const scrollableDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
  // progress va de 0 a 1 exactamente al mismo ritmo que el usuario baja por
  // la sección: el vaso queda "atado" al scroll, sin vida propia.
  const progress = Math.max(0, Math.min(1, -rect.top / scrollableDistance));
  const travel = 90; // recorrido total del vaso, de arriba a abajo, en px
  const y = progress * travel - travel / 2;
  const rotation = -6 + progress * 12;
  storyStage.style.setProperty("--cup-y", `${y}px`);
  storyStage.style.setProperty("--cup-rotate", `${rotation}deg`);
}

let motionFrame = null;
function requestStoryMotion() {
  if (motionFrame) return;
  motionFrame = requestAnimationFrame(() => {
    updateStoryMotion();
    motionFrame = null;
  });
}

if (storyStage && storySteps.length) {
  if ("IntersectionObserver" in window) {
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setStoryFlavor(entry.target.dataset.story);
      });
    }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
    storySteps.forEach((step) => storyObserver.observe(step));
  }
  window.addEventListener("scroll", requestStoryMotion, { passive: true });
  window.addEventListener("resize", requestStoryMotion);
  updateStoryMotion();
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

updateOrder();
