
const form = document.querySelector("#expense-form");
const nameInput = document.querySelector("#name");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const list = document.querySelector("#expense-list");
const setBudgetButton = document.querySelector("#set-budget");
const budgetInput = document.querySelector("#budget-input");
const remainingElement = document.querySelector("#remaining");
const totalElement = document.querySelector("#total");
const expenses = [];
let presupuesto = 0;
let chart = null;

setBudgetButton.addEventListener("click", () => {
    console.log("click") 
    const value = budgetInput.value.trim();
    if (isNaN(value) || Number(value) <= 0) {
        alert("Por favor, ingresa un presupuesto válido.");
        return;
    }
    presupuesto = Number(value);
    localStorage.setItem("presupuesto", presupuesto);
    document.querySelector("#budget").textContent = presupuesto;
    updateSummary();
    updateChart();
});

form.addEventListener("submit", (e) => {
    e.preventDefault(); //Previene el summit del formulario
    
    const expenseName = nameInput.value.trim();
    const amount = amountInput.value.trim();
    const category = categoryInput.value;

    if (!expenseName || !amount || !category) {
        alert("Por favor, completa todos los campos.");
        return;
    }
    if (isNaN(amount) || Number(amount) <= 0) {
        alert("Por favor, ingresa un monto válido.");
        return;
    }
    const expense = {
        id: Date.now(),
        name: expenseName,
        amount: Number(amount),
        category
    };
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    console.log("Gasto registrado:", expense);
    renderExpenses();
    form.reset();
    updateSummary();
    updateChart();
})
const renderExpenses = () => {
    list.innerHTML = "";
    expenses.forEach((expense) => {
        const li = document.createElement("li");
            li.innerHTML = `${expense.name} - $${expense.amount} (${expense.category})
            <button data-id="${expense.id}">❌</button>`;
        list.appendChild(li);
    });
};
list.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        const id = Number(e.target.dataset.id);
        const index = expenses.findIndex(exp => exp.id === id);
        if (index !== -1) {
            expenses.splice(index, 1);
            localStorage.setItem("expenses", JSON.stringify(expenses));
            renderExpenses();
            updateSummary();
            updateChart();
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("expenses");
    const savedBudget = localStorage.getItem("presupuesto");
    if (savedBudget) {
        presupuesto = Number(savedBudget);
        document.querySelector("#budget").textContent = presupuesto;
    }
    if (data) {
        expenses.push(...JSON.parse(data));
        renderExpenses();
    }
        updateSummary();
        updateChart();
});
const updateSummary = () => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const restante = presupuesto - total;
        if (restante < 0) {
            remainingElement.style.color = "red";
        } else {
            remainingElement.style.color = "black";
        }
    document.querySelector("#total").textContent = total;
    document.querySelector("#remaining").textContent = restante;
};
const updateChart = () => {
    const groupedExpenses = expenses.reduce((groups, expense) => {
        if (!groups[expense.category]) {
            groups[expense.category] = 0;
        }
        groups[expense.category] += expense.amount;
        return groups;
    }, {});
    const labels = Object.keys(groupedExpenses);
    const data = Object.values(groupedExpenses);
    const ctx = document.querySelector("#expense-chart");
    if (chart)  {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)"
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)"
                ],
                borderWidth: 2
            }]
        },
    });
}