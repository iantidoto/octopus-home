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

function guardarDatos() {
  localStorage.setItem("octopusData", JSON.stringify(data));
}

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

function actualizarTotales() {
  document.getElementById("incomeTotal").textContent = `${data.ingresos} €`;
  document.getElementById("expensesTotal").textContent = `${data.gastos} €`;
}
actualizarTotales();

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

function cargarPrevisiones() {
  forecastList.innerHTML = "";
  data.previsiones.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.nombre} | ${item.categoria} | ${item.monto} € | ${item.fecha} | ${item.nota}
      <button onclick="eliminarPrevision(${index})">🗑️</button>`;
    forecastList.appendChild(li);
  });

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

function eliminarPrevision(index) {
  data.previsiones.splice(index, 1);
  guardarDatos();
  cargarPrevisiones();
}

document.getElementById("incomeBox").addEventListener("click", () => {
  alert("Detalle de ingresos:\n- Beca: 133 €\n- Proyecto freelance: 527 €");
});

document.getElementById("expensesBox").addEventListener("click", () => {
  alert("Detalle de gastos:\n- Hogar: 250 €\n- Ocio: 100 €\n- Transporte: 50 €\n- Otros: 50 €");
});

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

const recurrenteSelect = document.getElementById("recurrente");
const personalizadoPanel = document.getElementById("personalizadoPanel");

recurrenteSelect.addEventListener("change", () => {
  if (recurrenteSelect.value === "personalizado") {
    personalizadoPanel.classList.remove("hidden");
  } else {
    personalizadoPanel.classList.add("hidden");
  }
});

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

  if (!data.categorias[nuevo.categoria]) {
    data.categorias[nuevo.categoria] = 0;
    const nuevaOpcion = document.createElement("option");
    nuevaOpcion.value = nuevo.categoria;
    categoriaList.appendChild(nuevaOpcion);
  }

  const hoyISO = today.toISOString().split("T")[0];

  if (nuevo.fecha <= hoyISO) {
    data.gastos += nuevo.monto;
    data.ingresos -= nuevo.monto;
    data.categorias[nuevo.categoria] += nuevo.monto;
  } else {
    data.previsiones.push(nuevo);
  }

  guardarDatos();
  actualizarTotales();
  cargarPrevisiones();
  actualizarGrafico();

  alert(`Movimiento guardado:\n${nuevo.nombre} | ${nuevo.categoria} | ${nuevo.monto} €`);
  modal.classList.add("hidden");
  form.reset();
  personalizadoPanel.classList.add("hidden");
}

);

const categoriaModal = document.getElementById("categoriaModal");
const openCategoriaModal = document.getElementById("openCategoriaModal");
const guardarCategoria = document.getElementById("guardarCategoria");
const cancelCategoria = document.getElementById("cancelCategoria");
const nuevaCategoriaInput = document.getElementById("nuevaCategoria");
const listaCategorias = document.getElementById("listaCategorias");
const categoriaList = document.getElementById("categoriaList");

openCategoriaModal.addEventListener("click", () => {
  categoriaModal.classList.remove("hidden");
  nuevaCategoriaInput.value = "";
  cargarListaCategorias();
});

cancelCategoria.addEventListener("click", () => {
  categoriaModal.classList.add("hidden");
});

guardarCategoria.addEventListener("click", () => {
  const nuevaCategoria = nuevaCategoriaInput.value.trim();
  if (nuevaCategoria === "") {
    alert("Por favor, escribe un nombre para la categoría.");
    return;
  }

  if (data.categorias[nuevaCategoria]) {
    alert("Esa categoría ya existe.");
    return;
  }

  data.categorias[nuevaCategoria] = 0;
  const nuevaOpcion = document.createElement("option");
  nuevaOpcion.value = nuevaCategoria;
  categoriaList.appendChild(nuevaOpcion);
  guardarDatos();
  cargarListaCategorias();
  alert(`Categoría "${nuevaCategoria}" añadida correctamente.`);
  nuevaCategoriaInput.value = "";
});

function cargarListaCategorias() {
  listaCategorias.innerHTML = "";
  Object.keys(data.categorias).forEach(cat => {
    const li = document.createElement("li");
    li.innerHTML = `${cat} <button onclick="eliminarCategoria('${cat}')">🗑️</button>`;
    listaCategorias.appendChild(li);
  });
}

function eliminarCategoria(nombre) {
  if (confirm(`¿Eliminar la categoría "${nombre}"?`)) {
    delete data.categorias[nombre];
    guardarDatos();
    cargarListaCategorias();
    actualizarGrafico();
    categoriaList.innerHTML = "";
    Object.keys(data.categorias).forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      categoriaList.appendChild(opt);
    });
  }
}

function actualizarGrafico() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(data.categorias),
      datasets: [{
        data: Object.values(data.categorias),
        backgroundColor: ["#fdd835", "#ef9a9a", "#90caf9", "#cfd8dc"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}
actualizarGrafico();
