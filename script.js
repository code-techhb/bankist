'use strict';
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const EUROTOUSD = 1.04;

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2025-02-20T21:31:17.178Z',
    '2025-02-21T07:42:02.383Z',
    '2025-02-18T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2025-01-31T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2025-02-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2025-02-21T13:15:33.035Z',
    '2019-01-30T09:48:16.867Z',
    '2025-02-15T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2023-01-18T18:49:59.371Z',
    '2025-02-20T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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
// -------------- Helper Functions ------------------
const formatDate = (date, locale) => {
  const daysAgo = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  };
  const daysPassed = daysAgo(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const formatCurrencies = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const movementAndDate = acc.movements.map((move, i) => {
    return { movement: move, movementDate: acc.movementsDates.at(i) };
  });

  if (sort) {
    movementAndDate.sort((a, b) => a.movement - b.movement);
  }

  movementAndDate.forEach(function (obj, i) {
    const { movement, movementDate } = obj;
    const typeOfMove = movement > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(movementDate);
    const displayDate = formatDate(date, acc.locale);

    const formattedMovement = formatCurrencies(
      movement,
      acc.locale,
      acc.currency
    );

    const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${typeOfMove}">${
      i + 1
    } ${typeOfMove}</div>
       <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce((accumulator, movement) => {
    return (accumulator += movement);
  }, 0);
  labelBalance.textContent = `${formatCurrencies(
    account.balance,
    account.locale,
    account.currency
  )}`;
};

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

const calcDisplaySummary = (account) => {
  const incomes = account.movements
    .filter((move) => move > 0)
    .reduce((total, move) => (total += move), 0);
  labelSumIn.textContent = `${formatCurrencies(
    incomes,
    account.locale,
    account.currency
  )}`;

  const outMoney = account.movements
    .filter((move) => move < 0)
    .reduce((spent, move) => (spent += move), 0);
  labelSumOut.textContent = `${formatCurrencies(
    outMoney,
    account.locale,
    account.currency
  )}`;

  const interest = account.movements
    .filter((move) => move > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((total, currentEL) => total + currentEL, 0);

  labelSumInterest.textContent = `${formatCurrencies(
    interest,
    account.locale,
    account.currency
  )}`;
};

const updateUI = (account) => {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
};

// -------------- Event Listeners ------------------
let currentAccount;

// 🚨 Temporary
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', (event) => {
  event.preventDefault();
  currentAccount = accounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  });

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language();
    const locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // add transfer dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //update ui
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
    labelWelcome.textContent = `Log in to get started`;
  }
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((move) => move >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

let sortedState = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sortedState);
  sortedState = !sortedState;
});

// ////// LECTURE Notes ///////
// Math in Js
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3)); //cubic root

// console.log(Math.max(44, 66, 2, 3, 4));

// console.log(Math.PI * Number.parseInt('10px') ** 2); //area of a cercle

// console.log(Math.trunc(Math.random() * 6)); // random btw 1 and 5, not 6. math.random generates numbers from 0 to 1

// const randomInt = (min, max) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };
// console.log(randomInt(3, 8));

// console.log(Math.trunc(22.4));
// console.log(Math.round(22.4));

// //rouding decimals
// console.log((2.45).toFixed(4)); // this is a string
// console.log(+(2.458789).toFixed(4)); // converted to num

//  labelBalance.addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) row.style.backgroundColor = 'pink';
//   });
// });

// Operations with Dates
const daysAgo = (date1, date2) => {
  return Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));
};

console.log(daysAgo(new Date(2025, 1, 30), new Date(2025, 1, 21)));
