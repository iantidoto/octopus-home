// Cargar datos desde localStorage o usar valores iniciales
let data = JSON.parse(localStorage.getItem("octopusData")) || {
  ingresos: 660,
  gastos: 450,
  categorias: {
    "Hogar": 250,
    "Ocio": 100,
    "Transporte": 50,
    "Otros": 50
  },
  previsiones: []
};

// Guardar datos en localStorage
function guardarDatos() {
  localStorage.setItem("octopusData", JSON.stringify(data));
}

// Generar selector de meses dinámico
const monthSelector = document.getElementById("monthSelector");
const today = new Date();

for (let i = 0; i < 12; i++) {
  const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
  const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  const label = date.toLocaleString("es-ES", { month: "long", year: "numeric" });
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label.charAt(0).toUpperCase() + label.slice(1);
  monthSelector.appendChild(option);
}

// Mostrar totales
function actualizarTotales() {
  document.getElementById("incomeTotal").textContent = `${data.ingresos} €`;
  document.getElementById("expensesTotal").textContent = `${data.gastos} €`;
}
actualizarTotales();

// Mostrar previsión en modal
const toggleBtn = document.getElementById("forecastToggle");
const forecastModal = document.getElementById("forecastModal");
const forecastList = document.getElementById("forecastList");
const closeForecast = document.getElementById("closeForecast");

toggleBtn.addEventListener("click", () => {
  forecastModal.classList.remove("hidden");
});

closeForecast.addEventListener("click", () => {
  forecastModal.classList.add("hidden");
});

// Cargar previsiones
function cargarPrevisiones() {
  forecastList.innerHTML = "";
  data.previsiones.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} | ${item.categoria} | ${item.monto} € | ${item.fecha} | ${item.nota}`;
    forecastList.appendChild(li);
  });

  // Detectar gastos recurrentes hoy
  const hoy = new Date();
  const diaHoy = hoy.getDate();

  data.previsiones.forEach(item => {
    if (item.recurrente && item.recurrente !== "único" && parseInt(item.dia) === diaHoy) {
      const li = document.createElement("li");
      li.textContent = `🔁 ${item.nombre} | ${item.categoria} | ${item.monto} € | HOY | ${item.nota}`;
      forecastList.appendChild(li);
    }
  });
}
cargarPrevisiones();

// Detalle al hacer clic en ingresos/gastos
document.getElementById("incomeBox").addEventListener("click", () => {
  alert("Detalle de ingresos:\n- Beca: 133 €\n- Proyecto freelance: 527 €");
});

document.getElementById("expensesBox").addEventListener("click", () => {
  alert("Detalle de gastos:\n- Hogar: 250 €\n- Ocio: 100 €\n- Transporte: 50 €\n- Otros: 50 €");
});

// Modal de nuevo movimiento
const modal = document.getElementById("expenseModal");
const addBtn = document.getElementById("addExpense");
const cancelBtn = document.getElementById("cancelModal");
const form = document.getElementById("expenseForm");

addBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Mostrar panel personalizado si se elige "personalizado"
const recurrenteSelect = document.getElementById("recurrente");
const personalizadoPanel = document.getElementById("personalizadoPanel");

recurrenteSelect.addEventListener("change", () => {
  if (recurrenteSelect.value === "personalizado") {
    personalizadoPanel.classList.remove("hidden");
  } else {
    personalizadoPanel.classList.add("hidden");
  }
});

// Guardar nuevo movimiento
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const categoriaInput = document.getElementById("categoriaInput");
  const categoriaList = document.getElementById("categoriaList");
  const tipoRecurrencia = document.getElementById("recurrente").value;
  const diaRecurrencia = document.getElementById("diaRecurrencia").value;

  const nuevo = {
    nombre: document.getElementById("nombre").value,
    categoria: categoriaInput.value.trim(),
    monto: parseFloat(document.getElementById("monto").value),
    fecha: document.getElementById("fecha").value,
    nota: document.getElementById("nota").value,
    recurrente: tipoRecurrencia,
    dia: tipoRecurrencia !== "único" ? parseInt(diaRecurrencia) : null
  };

  // Añadir nueva categoría si no existe
  const existe = Array.from(categoriaList.options).some(opt => opt.value === nuevo.categoria);
  if (!existe && nuevo.categoria !== "") {
    const nuevaOpcion = document.createElement("option");
    nuevaOpcion.value = nuevo.categoria;
    categoriaList.appendChild(nuevaOpcion);
  }

  const hoyISO = today.toISOString().split("T")[0];

  if (nuevo.fecha <= hoyISO) {
    data.gastos += nuevo.monto;
    data.ingresos -= nuevo.monto;
  } else {
    data.previsiones.push(nuevo);
  }

  guardarDatos();
  actualizarTotales();
  cargarPrevisiones();

  alert(`Movimiento guardado:\n${nuevo.nombre} | ${nuevo.categoria} | ${nuevo.monto} €`);
  modal.classList.add("hidden");
  form.reset();
  personalizadoPanel.classList.add("hidden");
});

// Modal de nueva categoría
const categoriaModal = document.getElementById("categoriaModal");
const openCategoriaModal = document.getElementById("openCategoriaModal");
const guardarCategoria = document.getElementById("guardarCategoria");
const cancelCategoria = document.getElementById("cancelCategoria");
const nuevaCategoriaInput = document.getElementById("nuevaCategoria");

openCategoriaModal.addEventListener("click", () => {
  categoriaModal.classList.remove("hidden");
  nuevaCategoriaInput.value = "";
});

cancelCategoria.addEventListener("click", () => {
  categoriaModal.classList.add("hidden");
});

guardarCategoria.addEventListener("click", () => {
  const nuevaCategoria = nuevaCategoriaInput.value.trim();
  const categoriaList = document.getElementById("categoriaList");

  if (nuevaCategoria === "") {
    alert("Por favor, escribe un nombre para la categoría.");
    return;
  }

  const existe = Array.from(categoriaList.options).some(opt => opt.value.toLowerCase() === nuevaCategoria.toLowerCase());
  if (existe) {
    alert("Esa categoría ya existe.");
    return;
  }

  const nuevaOpcion = document.createElement("option");
  nuevaOpcion.value = nuevaCategoria;
  categoriaList.appendChild(nuevaOpcion);
  alert(`Categoría "${nuevaCategoria}" añadida correctamente.`);
  categoriaModal.classList.add("hidden");
});
