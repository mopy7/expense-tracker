// create an empty array to store transaction
const transactions = [];

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


transactionForm.addEventListener("submit", function(e) {
  // prevents default refresh
  e.preventDefault();

  // read description input value
  const descriptionValue = description.value;
  // read amount input value
  const amountRaw = amount.value;
  // convert amount input to number
  const amountValue = Number(amountRaw);

  // if any input is empty or amount is not a number or amount is 0, show error message and stop function
  if (!descriptionValue.trim() || !amountRaw.trim() || isNaN(amountValue) || amountValue === 0) {
    alert("Invalid input");
    return;
  }

  // creating transaction object 
  const transaction = {
    // populating id for each transaction
    id: transactions.length + 1,

    description: descriptionValue,
    amount: amountValue
  };

  // adding new transaction object to transactions array
  transactions.push(transaction);
  console.log(transactions);

  // calling update UI
  render();
})


// function to clear transaction list update UI
function render() {
  // clear transaction list
  transactionList.innerHTML = "";

  // generate new transaction list
  // looping through objects in transactions array
  for (const transaction of transactions) {
    // create li
    const li = document.createElement("li");
    // set its text (description + amount)
    li.textContent = `${ transaction.description } ${ transaction.amount > 0 ? "+" : ""}${transaction.amount}`
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