// Datos simulados para mostrar en el dashboard
const data = {
  ingresos: 660,
  gastos: 450,
  previsiones: [
    { nombre: "Cuota autónomo", categoria: "Profesional", monto: 275, fecha: "15/10", nota: "Revisar recibo" },
    { nombre: "Netflix", categoria: "Ocio", monto: 12, fecha: "17/10", nota: "Último mes antes de cancelar" },
    { nombre: "Ingreso beca", categoria: "Educación", monto: -133, fecha: "20/10", nota: "Confirmar transferencia" }
  ]
};

// Mostrar totales
document.getElementById("incomeTotal").textContent = `${data.ingresos} €`;
document.getElementById("expensesTotal").textContent = `${data.gastos} €`;

// Mostrar previsión al hacer clic
const toggleBtn = document.getElementById("forecastToggle");
const forecastPanel = document.getElementById("forecastPanel");
const forecastList = document.getElementById("forecastList");

toggleBtn.addEventListener("click", () => {
  forecastPanel.classList.toggle("hidden");
});

// Cargar previsiones
data.previsiones.forEach(item => {
  const li = document.createElement("li");
  li.textContent = `${item.nombre} | ${item.categoria} | ${item.monto} € | ${item.fecha} | ${item.nota}`;
  forecastList.appendChild(li);
});

// Preparar botón de añadir (por ahora solo alerta)
document.getElementById("addExpense").addEventListener("click", () => {
  alert("Función de añadir movimiento aún en desarrollo.");
});
