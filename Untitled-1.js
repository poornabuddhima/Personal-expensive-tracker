// 1. Select DOM Elements
const form = document.getElementById('transactionForm');
const tableBody = document.getElementById('transactionTableBody');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpensesEl = document.getElementById('totalExpenses');
const currentBalanceEl = document.getElementById('currentBalance');
const filterSelect = document.getElementById('filterType');
const noTransactionsMsg = document.getElementById('noTransactions');

// 2. State (Array to hold transactions)
let transactions = [];

// 3. Load Data from LocalStorage
function loadTransactions() {
    const storedData = localStorage.getItem('transactions');
    if (storedData) {
        transactions = JSON.parse(storedData);
    }
    renderTable();
    calculateTotals();
}

// 4. Save Data to LocalStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// 5. Add Transaction (Form Submit)
form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page refresh

    // Get values
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Validation (Amount > 0)
    if (amount <= 0) {
        alert("Amount must be greater than zero.");
        return;
    }

    // Create transaction object
    const transaction = {
        id: Date.now(), // Unique ID
        type,
        description,
        amount,
        category,
        date
    };

    // Add to array
    transactions.push(transaction);
    saveTransactions();
    
    // Reset form & update UI
    form.reset();
    renderTable();
    calculateTotals();
    alert("Transaction added successfully!");
});

// 6. Render Table (Dynamic Table Update & Filter)
function renderTable() {
    tableBody.innerHTML = ''; // Clear table
    const filterValue = filterSelect.value;

    // Filter Logic
    let filteredTransactions = transactions;
    if (filterValue !== 'All') {
        filteredTransactions = transactions.filter(t => t.type === filterValue);
    }

    // Show message if no data
    if (filteredTransactions.length === 0) {
        noTransactionsMsg.style.display = 'block';
    } else {
        noTransactionsMsg.style.display = 'none';
    }

    // Loop & Display
    filteredTransactions.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.date}</td>
            <td>${t.description}</td>
            <td>
                <span class="badge ${t.type === 'Income' ? 'bg-success' : 'bg-danger'}">
                    ${t.type}
                </span>
            </td>
            <td>${t.category}</td>
            <td class="${t.type === 'Income' ? 'text-success' : 'text-danger'}">
                ${t.type === 'Income' ? '+' : '-'} LKR ${t.amount.toFixed(2)}
            </td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteTransaction(${t.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 7. Delete Transaction
function deleteTransaction(id) {
    if (confirm("Are you sure you want to delete this transaction?")) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        renderTable();
        calculateTotals();
    }
}

// 8. Calculate Totals
function calculateTotals() {
    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
        if (t.type === 'Income') {
            income += t.amount;
        } else {
            expenses += t.amount;
        }
    });

    const balance = income - expenses;

    totalIncomeEl.textContent = `LKR ${income.toFixed(2)}`;
    totalExpensesEl.textContent = `LKR ${expenses.toFixed(2)}`;
    currentBalanceEl.textContent = `LKR ${balance.toFixed(2)}`;
}

// 9. Filter Event Listener
filterSelect.addEventListener('change', renderTable);

// 10. Initialize App
loadTransactions();