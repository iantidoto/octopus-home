const data = {
  ingresos: 660,
  gastos: 450,
  categorias: {
    "Hogar": 250,
    "Ocio": 100,
    "Transporte": 50,
    "Otros": 50
  },
  previsiones: [
    { nombre: "Cuota autónomo", categoria: "Profesional", monto: 275, fecha: "2025-10-15", nota: "Revisar recibo" },
    { nombre: "Netflix", categoria: "Ocio", monto: 12, fecha: "2025-10-17", nota: "Último mes antes de cancelar" },
    { nombre: "Ingreso beca", categoria: "Educación", monto: -133, fecha: "2025-10-20", nota: "Confirmar transferencia" }
  ]
};

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
document.getElementById("incomeTotal").textContent = `${data.ingresos} €`;
document.getElementById("expensesTotal").textContent = `${data.gastos} €`;

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

// Cargar previsiones iniciales
data.previsiones.forEach(item => {
  const li = document.createElement("li");
  li.textContent = `${item.nombre} | ${item.categoria} | ${item.monto} € | ${item.fecha} | ${item.nota}`;
  forecastList.appendChild(li);
});

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
    frecuencia: tipoRecurrencia === "personalizado" ? `Día ${diaRecurrencia}` : ""
  };

  // Añadir nueva categoría si no existe
  const existe = Array.from(categoriaList.options).some(opt => opt.value === nuevo.categoria);
  if (!existe && nuevo.categoria !== "") {
    const nuevaOpcion = document.createElement("option");
    nuevaOpcion.value = nuevo.categoria;
    categoriaList.appendChild(nuevaOpcion);
  }

  const hoy = new Date().toISOString().split("T")[0];

  if (nuevo.fecha <= hoy) {
    // Gasto ya realizado
    data.gastos += nuevo.monto;
    data.ingresos -= nuevo.monto;
    document.getElementById("expensesTotal").textContent = `${data.gastos} €`;
    document.getElementById("incomeTotal").textContent = `${data.ingresos} €`;
  } else {
    // Gasto futuro → previsión
    const li = document.createElement("li");
    li.textContent = `${nuevo.nombre} | ${nuevo.categoria} | ${nuevo.monto} € | ${nuevo.fecha} | ${nuevo.nota}`;
    forecastList.appendChild(li);
  }

  alert(`Movimiento guardado:\n${nuevo.nombre} | ${nuevo.categoria} | ${nuevo.monto} €`);
  modal.classList.add("hidden");
  form.reset();
  personalizadoPanel.classList.add("hidden");
});

// Gráfico circular
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
