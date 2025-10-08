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

document.getElementById("incomeTotal").textContent = `${data.ingresos} €`;
document.getElementById("expensesTotal").textContent = `${data.gastos} €`;

const toggleBtn = document.getElementById("forecastToggle");
const forecastPanel = document.getElementById("forecastPanel");
const forecastList = document.getElementById("forecastList");

toggleBtn.addEventListener("click", () => {
  forecastPanel.classList.toggle("visible");
});

data.previsiones.forEach(item => {
  const li = document.createElement("li");
  li.textContent = `${item.nombre} | ${item.categoria} | ${item.monto} € | ${item.fecha} | ${item.nota}`;
  forecastList.appendChild(li);
});

document.getElementById("addExpense").addEventListener("click", () => {
  alert("Función de añadir movimiento aún en desarrollo.");
});

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
