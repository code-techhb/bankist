'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const EUROTOUSD = 1.04;

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// Helper functions
const displayMovements = (movements) => {
  // empty the container
  containerMovements.innerHTML = '';

  movements.forEach(function (move, i) {
    const typeOfMove = move > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${typeOfMove}">${
      i + 1
    } ${typeOfMove}</div>
            <div class="movements__value">${move}</div>
        </div>
    `;
    // populate the container
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// update balance in the UI
const calcDisplayBalance = (movements) => {
  const balance = movements.reduce((accumulator, movement) => {
    return (accumulator += movement);
  }, 0);
  labelBalance.textContent = `€ ${balance}`;
};
calcDisplayBalance(account1.movements);

// username creation
const createUsernameInitials = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsernameInitials(accounts);

// Display balance
const calcDisplaySummary = (account) => {
  const incomes = account.movements
    .filter((move) => move > 0)
    .reduce((total, move) => (total += move), 0);

  labelSumIn.textContent = `${incomes}€`;

  const outMoney = account.movements
    .filter((move) => move < 0)
    .reduce((spent, move) => (spent += move), 0);
  labelSumOut.textContent = `${Math.abs(outMoney)}€`;

  const interst = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((total, currentEL) => total + currentEL, 0);

  labelSumInterest.textContent = `${interst}€`;
};

// user login
let currentAccount;
btnLogin.addEventListener('click', (event) => {
  event.preventDefault();
  currentAccount = accounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    displayMovements(currentAccount.movements);
    calcDisplayBalance(currentAccount.movements);
    calcDisplaySummary(currentAccount);

    console.log('Logged in');
  }
});

// LECTURE NOTES
// // conversion from euro to usd
// const movements = account1.movements;
// const movementsUSD = movements.map((move) => {
//   return move * EUROTOUSD;
// });

// // filter deposits
// const deposits = movements.filter((move) => {
//   return move > 0;
// });
// // console.log(deposits);
// // console.log(movements);

// // withdrawals
// const withdrawals = movements.filter((move) => {
//   return move < 0;
// });

// const totalDepositUSD = account1.movements
//   .filter((move) => {
//     return move > 0;
//   })
//   .map((move) => {
//     return move * EUROTOUSD;
//   })
//   .reduce((total, currentEL) => {
//     return (total += currentEL);
//   }, 0);
// console.log(totalDepositUSD);

// // find method: Retrieve one element from an arr based on a condition. It does accept a callback function too.
// const firstWithDraw = movements.find((move) => move < 0);
// console.log(firstWithDraw);
