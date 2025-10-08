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
    { nombre: "Cuota autónomo", categoria: "Profesional", monto: 275, fecha: "15/10", nota: "Revisar recibo" },
    { nombre: "Netflix", categoria: "Ocio", monto: 12, fecha: "17/10", nota: "Último mes antes de cancelar" },
    { nombre: "Ingreso beca", categoria: "Educación", monto: -133, fecha: "20/10", nota: "Confirmar transferencia" }
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

// Mostrar previsión con animación
const toggleBtn = document.getElementById("forecastToggle");
const forecastPanel = document.getElementById("forecastPanel");
const forecastList = document.getElementById("forecastList");

toggleBtn.addEventListener("click", () => {
  forecastPanel.classList.toggle("visible");
});

// Cargar previsiones
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nuevo = {
    nombre: document.getElementById("nombre").value,
    categoria: document.getElementById("categoria").value,
    monto: parseFloat(document.getElementById("monto").value),
    fecha: document.getElementById("fecha").value,
    nota: document.getElementById("nota").value,
    repeticion: document.getElementById("repeticion").value
  };

  alert(`Movimiento guardado:\n${nuevo.nombre} | ${nuevo.categoria} | ${nuevo.monto} €`);
  modal.classList.add("hidden");
  form.reset();
});
