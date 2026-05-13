let transactions = [];
let categories = ["Food", "Transportation", "Entertainment", "Salary", "Other"];

// Fetch transactions from Firebase
document.addEventListener('DOMContentLoaded', () => {
    fetchTransactions();
});

// Fetch transactions
function fetchTransactions() {
    db.collection("transactions").get().then(snapshot => {
        transactions = [];
        snapshot.forEach(doc => transactions.push(doc.data()));
        showDashboard();
    }).catch(error => {
        console.error("Error getting documents: ", error);
    });
}

// Show Dashboard
function showDashboard() {
    const contentDiv = document.getElementById('content');
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += parseFloat(transaction.amount);
        } else {
            totalExpenses += parseFloat(transaction.amount);
        }
    });

    const dashboardHTML = `
        <h2>Dashboard</h2>
        <div class="summary">
            <p><strong>Total Income:</strong> <span class="income">$${totalIncome.toFixed(2)}</span></p>
            <p><strong>Total Expenses:</strong> <span class="expense">-$${totalExpenses.toFixed(2)}</span></p>
            <p><strong>Net Balance:</strong> $${(totalIncome - totalExpenses).toFixed(2)}</p>
        </div>
        <h3>Recent Transactions</h3>
        ${renderTransactionList(transactions.slice(-5).reverse())}
    `;
    contentDiv.innerHTML = dashboardHTML;
}

// Show all transactions
function showTransactions() {
    const contentDiv = document.getElementById('content');
    const transactionsHTML = `
        <h2>Transactions</h2>
        ${renderTransactionList(transactions)}
    `;
    contentDiv.innerHTML = transactionsHTML;
}

// Render transaction list
function renderTransactionList(transactionArray) {
    if (transactionArray.length === 0) {
        return "<p>No transactions yet.</p>";
    }
    let listHTML = '<ul class="transaction-list">';
    transactionArray.forEach(transaction => {
        listHTML += `
            <li class="transaction-item">
                <span>${transaction.date}</span>
                <span>${transaction.description}</span>
                <span>${transaction.category}</span>
                <span class="${transaction.type}">${transaction.type === 'income' ? '+' : '-'}$${parseFloat(transaction.amount).toFixed(2)}</span>
            </li>
        `;
    });
    listHTML += '</ul>';
    return listHTML;
}

// Show Add Transaction form
function showAddTransaction() {
    const contentDiv = document.getElementById('content');
    const categoriesOptions = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    const addTransactionHTML = `
        <h2>Add New Transaction</h2>
        <form class="transaction-form" id="addTransactionForm">
            <div>
                <label for="type">Type:</label>
                <select id="type" name="type">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>
            </div>
            <div>
                <label for="amount">Amount:</label>
                <input type="number" id="amount" name="amount" required>
            </div>
            <div>
                <label for="category">Category:</label>
                <select id="category" name="category">
                    ${categoriesOptions}
                </select>
            </div>
            <div>
                <label for="description">Description:</label>
                <input type="text" id="description" name="description">
            </div>
            <div>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required>
            </div>
            <button type="button" onclick="addTransaction()">Add Transaction</button>
        </form>
    `;
    contentDiv.innerHTML = addTransactionHTML;
}

// Add a new transaction to Firebase
function addTransaction() {
    const type = document.getElementById('type').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const date = document.getElementById('date').value;

    if (!amount || !date) {
        alert('Amount and Date are required.');
        return;
    }

    db.collection("transactions").add({
        type,
        amount,
        category,
        description,
        date
    }).then(() => {
        fetchTransactions();
    }).catch(error => {
        console.error("Error adding document: ", error);
    });
}

// Show Categories
function showCategories() {
    const contentDiv = document.getElementById('content');
    const categoriesHTML = `
        <h2>Categories</h2>
        <ul>
            ${categories.map(cat => `<li>${cat}</li>`).join('')}
        </ul>
        <h3>Add New Category</h3>
        <form id="addCategoryForm">
            <input type="text" id="newCategory" placeholder="Category Name">
            <button type="button" onclick="addCategory()">Add Category</button>
        </form>
    `;
    contentDiv.innerHTML = categoriesHTML;
}

// Add a new category
function addCategory() {
    const newCategoryInput = document.getElementById('newCategory');
    const newCategoryName = newCategoryInput.value.trim();
    if (newCategoryName) {
        categories.push(newCategoryName);
        newCategoryInput.value = '';
        showCategories();
    } else {
        alert('Please enter a category name.');
    }
}
