const transactionButtons = document.querySelectorAll('.transaction-container-sideBar-items');
const accNoDiv = document.querySelectorAll('.navBar-item')[0];
const balanceDiv = document.querySelector('.balance');
const choosingBank = document.getElementById('choosingBank');

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const users = await getUsers();
    console.log(users);
    const onlineUser = onlineUsers(users);
    navbarDatas(onlineUser);
    evenListeners(users, onlineUser);
    isThereRequest(users, onlineUser);
  } catch (error) {
    console.error(error.message);
  }

  async function isThereRequest(users, onlineUser) {
    try {
      const hisName = 'a';
      const requestAmount = parseFloat(onlineUser.requestAmount);
      const hisAccNo = onlineUser.requestAccNo; // who wants money

      if (onlineUser.isRequest) {
        if (confirm(`The user numbered ${hisAccNo} has sent you a ${requestAmount}$ money request.\nPress Ok or Cancel`)) {
          if (onlineUser.balance < requestAmount) {
            alert('Insufficient balance !!');
          } else {
            transferOrRequest(users, onlineUser, requestAmount, hisName, hisAccNo);
            onlineUser.balance -= requestAmount;
            await updateUser(onlineUser.id, onlineUser);
          }
        }
      }
      onlineUser.isRequest = false;
      onlineUser.requestAccNo = 0;
      onlineUser.requestAmount = 0;
      await updateUser(onlineUser.id, onlineUser);
      navbarDatas(onlineUser);
    } catch (error) {
      console.error(error.message);
    }
  }

  function onlineUsers(users) {
    try {
      return users.find(user => user.online);
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }

  async function updateUser(userId, newData) {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async function getUsers() {
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users from db:', error);
      throw error;
    }
  }

  function navbarDatas(onlineUser) {
    accNoDiv.textContent = `Account No: ${onlineUser.accountNo}`;
    balanceDiv.innerText = `Balance: ${onlineUser.balance} $`;
  }

  function evenListeners(users, onlineUser) {
    transactionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const targetClassList = e.target.classList;
        console.log(targetClassList);
        choosingBank.innerHTML = '<h5 id="choosingText">Click On The Action On The Left Side You Want</h5>';
        const choosingText = document.querySelector('#choosingText');

        if (targetClassList.contains('invest-btn')) {
          choosingText.innerText = 'INVEST MONEY';
          htmlInvestAndWithdraw(onlineUser, true);

        } else if (targetClassList.contains('withdraw-btn')) {
          choosingText.innerText = 'WITHDRAW MONEY';
          htmlInvestAndWithdraw(onlineUser, false);

        } else if (targetClassList.contains('transfer-btn')) {
          choosingText.innerText = 'TRANSFER MONEY TO ANOTHER ACCOUNT';
          htmlTransferAndRequest(users, onlineUser, true);

        } else if (targetClassList.contains('request-btn')) {
          choosingText.innerText = 'REQUEST MONEY FROM ANOTHER ACCOUNT';
          htmlTransferAndRequest(users, onlineUser, false);

        } else if (targetClassList.contains('sign-out-btn')) {
          signOut();
        }
      });
    });
  }

  function htmlInvestAndWithdraw(onlineUser, isInvest) {
    const investingOrWithdrawingMoneyDiv = document.createElement('div');
    investingOrWithdrawingMoneyDiv.setAttribute('id', 'investingOrWithdrawingDiv');
    choosingBank.appendChild(investingOrWithdrawingMoneyDiv);

    const nameDiv = document.createElement('div');
    nameDiv.setAttribute('id', 'nameDiv');
    investingOrWithdrawingMoneyDiv.appendChild(nameDiv);

    const nameLabel = document.createElement('label');
    nameLabel.setAttribute('id', 'nameLabel');
    nameLabel.innerText = 'Your Name : ';
    nameDiv.appendChild(nameLabel);

    const nameInput = document.createElement('input');
    nameInput.classList.add("nameInput", "input");
    nameDiv.appendChild(nameInput);

    const moneyDiv = document.createElement('div');
    moneyDiv.setAttribute('id', 'moneyDiv');
    investingOrWithdrawingMoneyDiv.appendChild(moneyDiv);

    const moneyLabel = document.createElement('label');
    moneyLabel.setAttribute('id', 'moneyLabel');
    moneyLabel.innerText = 'Amount : '
    moneyDiv.appendChild(moneyLabel);

    const moneyInput = document.createElement('input');
    moneyInput.classList.add("moneyInput", "input");
    moneyInput.setAttribute("type", "number");
    moneyDiv.appendChild(moneyInput);

    const applyButton = document.createElement('button');
    applyButton.classList.add('apply-btn', isInvest ? 'apply-invest' : 'apply-withdraw');
    applyButton.innerText = 'Apply'
    investingOrWithdrawingMoneyDiv.appendChild(applyButton);

    applyButton.addEventListener('click', () => {
      let inputMoney = parseFloat(moneyInput.value);
      let currentBalance = parseFloat(onlineUser.balance);
      if (!nameInput.value || !inputMoney) {
        alert('Please fill the form correctly');
        return;
      }
      if (isInvest) {
        currentBalance += inputMoney;
      } else {
        if (currentBalance < inputMoney) {
          alert('Insufficient balance !!');
          return;
        }
        currentBalance -= inputMoney;
      }
      onlineUser.balance = currentBalance;
      updateUser(onlineUser.id, onlineUser)
        .then(() => {
          nameInput.value = '';
          moneyInput.value = '';
        })
        .catch(error => console.error(error.message));
    });
  }

  function htmlTransferAndRequest(users, onlineUser, isTransfer) {
    const transferingOrRequestingMoneyDiv = document.createElement('div');
    transferingOrRequestingMoneyDiv.setAttribute('id', 'transferingOrRequestingDiv');
    choosingBank.appendChild(transferingOrRequestingMoneyDiv);

    const nameDiv2 = document.createElement('div');
    nameDiv2.setAttribute('id', 'nameDiv2');
    transferingOrRequestingMoneyDiv.appendChild(nameDiv2);

    const nameLabel2 = document.createElement('label');
    nameLabel2.setAttribute('id', 'nameLabel2');
    nameLabel2.innerText = isTransfer ? 'His/Her Name : ' : 'Your Name : ';
    nameDiv2.appendChild(nameLabel2);

    const nameInput2 = document.createElement('input');
    nameInput2.classList.add("nameInput2", "input");
    nameDiv2.appendChild(nameInput2);

    const moneyDiv2 = document.createElement('div');
    moneyDiv2.setAttribute('id', 'moneyDiv2');
    transferingOrRequestingMoneyDiv.appendChild(moneyDiv2);

    const moneyLabel2 = document.createElement('label');
    moneyLabel2.setAttribute('id', 'moneyLabel2');
    moneyLabel2.innerText = 'Amount : '
    moneyDiv2.appendChild(moneyLabel2);

    const moneyInput2 = document.createElement('input');
    moneyInput2.classList.add("moneyInput2", "input");
    moneyInput2.setAttribute("type", "number");
    moneyDiv2.appendChild(moneyInput2);

    const accNoDiv = document.createElement('div');
    accNoDiv.setAttribute('id', 'accNoDiv');
    transferingOrRequestingMoneyDiv.appendChild(accNoDiv);

    const accNoLabel = document.createElement('label');
    accNoLabel.setAttribute('id', 'accNoLabel');
    accNoLabel.innerText = 'His/Her Accout No : '
    accNoDiv.appendChild(accNoLabel);

    const accNoInput = document.createElement('input');
    accNoInput.classList.add("accNoInput", "input");
    accNoInput.setAttribute("type", "number");
    accNoDiv.appendChild(accNoInput);


    if (isTransfer) {
      const applyButtonForTransfering = document.createElement('button');
      applyButtonForTransfering.classList.add('apply-btn', 'apply-transfer');
      applyButtonForTransfering.innerText = 'Apply'
      transferingOrRequestingMoneyDiv.appendChild(applyButtonForTransfering);

      applyButtonForTransfering.addEventListener('click', () => {
        const inputMoney = parseFloat(moneyInput2.value);
        const accNo = Number(accNoInput.value);
        transferOrRequest(users, onlineUser, inputMoney, nameInput2.value, accNo, isTransfer);
        nameInput2.value = '';
        moneyInput2.value = '';
        accNoInput.value = '';
      });
    } else {
      const applyButtonForRequesting = document.createElement('button');
      applyButtonForRequesting.classList.add('apply-btn', 'apply-request');
      applyButtonForRequesting.innerText = 'Apply'
      transferingOrRequestingMoneyDiv.appendChild(applyButtonForRequesting);

      applyButtonForRequesting.addEventListener('click', () => {
        const inputMoney = parseFloat(moneyInput2.value);
        const accNo = Number(accNoInput.value);
        transferOrRequest(users, onlineUser, inputMoney, nameInput2.value, accNo, isTransfer);
      });
    }
  }


  function transferOrRequest(users, onlineUser, inputMoney, inputName, accNo, isTransfer) {
    let currentBalance = parseFloat(onlineUser.balance);

    if (!inputName || !inputMoney || !accNo) {
      alert('Please fill the form correctly');
      return;
    }
    console.log(accNo)
    const matchingUser = users.find(user => user.accountNo === accNo);

    if (!matchingUser) {
      alert('This account number is not found in the system');
      return;
    }
    if (matchingUser.accountNo === onlineUser.accountNo) {
      alert('You cannot send money to yourself');
      return;
    }

    if (onlineUser.isRequest) {
      matchingUser.balance += inputMoney;
      updateUser(matchingUser.id, matchingUser);
    }

    if (!onlineUser.isRequest && isTransfer) {
      if (inputMoney > 0) {
        if (currentBalance < inputMoney) {
          alert('Insufficient balance !!');
          return;
        }
        currentBalance -= inputMoney;
      }

      onlineUser.balance = currentBalance;
      matchingUser.balance += inputMoney;
      updateUser(matchingUser.id, matchingUser);
      updateUser(onlineUser.id, onlineUser)
        .then(() => {
          if (!onlineUser.isRequest) {
            alert(`${inputMoney}$ ${inputMoney > 0 ? 'transferred to' : 'requested from'} the user numbered ${matchingUser.accountNo}`);
          }
        })
        .catch(error => console.error(error.message));
    } else if(!onlineUser.isRequest && !isTransfer) {
      if(inputMoney > 0) {
        matchingUser.isRequest = true;
        matchingUser.requestAccNo = onlineUser.accountNo;
        matchingUser.requestAmount = inputMoney;
        updateUser(matchingUser.id, matchingUser)
           .then(() => {
               alert(`${inputMoney}$ 'requested from' the user numbered ${matchingUser.accountNo}`);
           })
      }
    }
  }

  async function signOut() {
    const users = await getUsers();
    const onlineUser = await onlineUsers(users);
    onlineUser.online = false;
    await updateUser(onlineUser.id, onlineUser)
      .catch(error => console.error(error.message));
    window.location.href = '../login/index.html';  
  }
  

  const images = document.getElementById('images');
  const a = document.getElementById('a-tag');
  let i = 0;
  setInterval(() => {
    const imageSources = ['./img/Galaxy S23.jpg', './img/Galaxy Z Fold3 5G.jpg', './img/Galaxy S21 Ultra 5G.jpg', './img/Galaxy S22 Ultra.jpg'];
    const links = [
      'https://www.samsung.com/us/smartphones/galaxy-s23/buy/galaxy-s23-256gb-unlocked-sm-s911uzkexaa/',
      'https://www.samsung.com/us/smartphones/galaxy-z-fold3-5g/buy/galaxy-z-fold3-5g-256gb-unlocked-sm-f926uzkaxaa/?modelCode=SM-F926UZKAXAA',
      'https://www.samsung.com/us/smartphones/galaxy-s-series/certified-re-newed-store/buy/?modelCode=SM5G998UZKAXAA',
      'https://www.samsung.com/us/smartphones/galaxy-s22-ultra/buy/galaxy-s22-ultra-128gb-unlocked-sm-s908udraxaa/?modelCode=SM-S908UZREXAA'
    ];
    if (i === 4) {
      i = 0;
    }
    images.setAttribute('src', imageSources[i]);
    a.setAttribute('href', links[i]);
    i++;
  }, 2000);

});
