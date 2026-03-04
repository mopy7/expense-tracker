/* STATE */

// create an empty array to store transaction
let transactions = [];

/* DOM ELEMENTS */

// selecting transaction form element
const transactionForm = document.querySelector("#transaction-form");
// selecting transaction form description input element
const description = document.querySelector("#description");
// selecting transaction form amount input element
const amount = document.querySelector("#amount");
// selecting transactions list element
const transactionList = document.querySelector("#transaction-list");
// selecting balance element
const balanceElement = document.getElementById("balance");
// selecting income element
const incomeElement = document.getElementById("income");
// selecting expense element
const expenseElement = document.getElementById("expense");

/* STORAGE */

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {
  const storedTransactions = localStorage.getItem("transactions");

  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
  }
}

/* EVENT LISTENERS */

// submit handler
transactionForm.addEventListener("submit", function (event) {
  // prevents default refresh
  event.preventDefault();

  // read description input value
  const descriptionValue = description.value;
  // read amount input value
  const amountRaw = amount.value;
  // convert amount input to number
  const amountValue = Number(amountRaw);

  // if any input is empty or amount is not a number or amount is 0, show error message and stop function
  if (
    !descriptionValue.trim() ||
    !amountRaw.trim() ||
    isNaN(amountValue) ||
    amountValue === 0
  ) {
    alert("Invalid input");
    return;
  }

  // creating transaction object
  const transaction = {
    // populating id for each transaction
    id: Date.now(),

    description: descriptionValue,
    amount: amountValue,
  };

  // adding new transaction object to transactions array
  transactions.push(transaction);
  // console.log(transactions);

  // save transactions
  saveTransactions();
  // reset form
  transactionForm.reset();
  // calling update UI
  render();
});

// LISTEN for click events on transactionList (the <ul>)
transactionList.addEventListener("click", function (event) {
  // IF clicked element is a delete button
  if (event.target.tagName === "BUTTON") {
    // get parent <li>, read data-id and convert to number
    const id = Number(event.target.parentElement.dataset.id);
    // keep all transactions except the clicked one
    transactions = transactions.filter((transaction) => transaction.id !== id);
    // save transactions
    saveTransactions();
    // update state
    render();
  }
});

/* RENDER */

// function to clear transaction list update UI
function render() {
  // clear transaction list
  transactionList.innerHTML = "";

  // generate new transaction list
  // looping through objects in transactions array
  for (const transaction of transactions) {
    // create li
    const li = document.createElement("li");
    // attach transaction id to <li> using data-id
    li.dataset.id = transaction.id;
    // set its text (description + amount)
    li.textContent = `${transaction.description} ${transaction.amount > 0 ? "+" : ""}${transaction.amount}`;
    // create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    // append delete button to <li>
    li.append(deleteButton);
    // append li to transactionList
    transactionList.append(li);
  }

  //  calculate totals
  const balance = transactions.reduce((total, transaction) => {
    return total + transaction.amount;
  }, 0);

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  //  update balance, income, expense
  balanceElement.textContent = balance;
  incomeElement.textContent = income;
  expenseElement.textContent = Math.abs(expense);
}

/* APP START */

// load stored transaction
loadTransactions();
// update state
render();
