
const form = document.querySelector("#expense-form");
const nameInput = document.querySelector("#name");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const list = document.querySelector("#expense-list");
const setBudgetButton = document.querySelector("#set-budget");
const expenses = [];
const presupuesto = 1000;

setBudgetButton.addEventListener("click", () => {
    console.log("click") 
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
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("expenses");

    if (data) {
        expenses.push(...JSON.parse(data));
        renderExpenses();
    }
});
const updateSummary = () => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const restante = presupuesto - total;
    
};