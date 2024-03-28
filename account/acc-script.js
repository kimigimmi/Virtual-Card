
const transactionButtons = document.querySelectorAll('.transaction-container-sideBar-items');
const accNoDiv = document.querySelectorAll('.navBar-item')[0];
const balanceDiv = document.querySelector('.balance');
const choosingBank = document.getElementById('choosingBank');


document.addEventListener("DOMContentLoaded", () => {
  navbarDatas();
  evenListeners();
  isThereRequest();


  function isThereRequest() {
    const onlineUser = onlineUsers();
    const hisName = 'a';
    const requestAmount = parseFloat(onlineUser.requestAmount);
    const hisAccNo = onlineUser.requestAccNo;     // who wants money

    if (onlineUser.isRequest) {
      if (confirm(`The user numbered ${hisAccNo} has sent you a ${requestAmount}$ money request.\nPress Ok or Cancel`)) {
        if (onlineUser.balance < requestAmount) {
          alert('Insufficient balance !!');
        } else {
          transferOrRequest(requestAmount, hisName, hisAccNo);
          onlineUser.balance -= requestAmount;
        }
      }
    }
    onlineUser.isRequest = false;
    onlineUser.requestAccNo = 0;
    onlineUser.requestAmount = 0;
    setItem(onlineUser);
    navbarDatas();
  }



  function navbarDatas() {
    const onlineUser = onlineUsers();
    accNoDiv.textContent = `Account No: ${onlineUser.accountNo}`;
    balanceDiv.innerText = `Balance: ${onlineUser.balance} $`;
  }


  // get online user obj 
  function onlineUsers() {
    const users = getItem();
    const onlineUser = users.filter(user => user.online)[0];   // gives obj
    return onlineUser;
  }


  // get item from local storage
  function getItem() {
    return JSON.parse(localStorage.getItem('userInfos'));
  }


  // set item to local storage
  function setItem(user) {          // for online user or for requesting money user
    const users = getItem();
    for (let i = 0; i < users.length; i++) {
      if (users[i].accountNo === user.accountNo) {
        users[i] = user;
      }
    }
    localStorage.setItem('userInfos', JSON.stringify(users));
    navbarDatas();
  }


  let buttonForInvestingClicked = false;
  let buttonForWithdrawingClicked = false;
  let buttonForTransferingClicked = false;
  let buttonForRequestingClicked = false;

  // Event Listeners
  function evenListeners() {
    transactionButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const targetClassList = e.target.classList;
        console.log(targetClassList);
        choosingBank.innerHTML = '<h5 id="choosingText">Click On The Action On The Left Side You Want</h5>';
        const choosingText = document.querySelector('#choosingText');

        if (targetClassList.contains('invest-btn')) {
          choosingText.innerText = 'INVEST MONEY';
          buttonForInvestingClicked = true;
          buttonForWithdrawingClicked = false;
          htmlInvestAndWithdraw();

        } else if (targetClassList.contains('withdraw-btn')) {
          choosingText.innerText = 'WITHDRAW MONEY';
          buttonForInvestingClicked = false;
          buttonForWithdrawingClicked = true;
          htmlInvestAndWithdraw();

        } else if (targetClassList.contains('transfer-btn')) {
          choosingText.innerText = 'TRANSFER MONEY TO ANOTHER ACCOUNT';
          buttonForTransferingClicked = true;
          buttonForRequestingClicked = false;
          htmlTransferAndRequest();

        } else if (targetClassList.contains('request-btn')) {
          choosingText.innerText = 'REQUEST MONEY FROM ANOTHER ACCOUNT';
          buttonForTransferingClicked = false;
          buttonForRequestingClicked = true;
          htmlTransferAndRequest();

        } else if (targetClassList.contains('sign-out-btn')) {
          signOut();
        }
      });
    });
  }



  // Invest or withdraw money 
  function htmlInvestAndWithdraw() {
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
    moneyDiv.appendChild(moneyInput);


    if (buttonForInvestingClicked) {
      const applyButtonForInvesting = document.createElement('button');
      applyButtonForInvesting.classList.add('apply-btn', 'apply-invest');
      applyButtonForInvesting.innerText = 'Apply'
      investingOrWithdrawingMoneyDiv.appendChild(applyButtonForInvesting);

      applyButtonForInvesting.addEventListener('click', (e) => {
        const inputMoney = parseFloat(moneyInput.value);
        sumOrSubstraction(inputMoney);
      });
    }

    if (buttonForWithdrawingClicked) {
      const applyButtonForWithdrawing = document.createElement('button');
      applyButtonForWithdrawing.classList.add('apply-btn', 'apply-withdraw');
      applyButtonForWithdrawing.innerText = 'Apply'
      investingOrWithdrawingMoneyDiv.appendChild(applyButtonForWithdrawing);

      applyButtonForWithdrawing.addEventListener('click', () => {
        const user = onlineUsers();
        if (user.balance < moneyInput.value) {
          alert('Insufficient balance !!');
          return;
        }
        const inputMoney = - parseFloat(moneyInput.value);
        sumOrSubstraction(inputMoney);
      });
    }


    function sumOrSubstraction(inputMoney) {
      const user = onlineUsers();
      let currentBalance = parseFloat(user.balance);
      const inputName = nameInput.value;
      if (!inputName || !inputMoney) {
        alert('Please fill the form correctly');
        return;
      }
      currentBalance += inputMoney;
      user.balance = currentBalance;
      setItem(user)
      nameInput.value = '';
      moneyInput.value = '';
    }

  }



  // Transfer to or request money from other accounts
  function htmlTransferAndRequest() {
    const transferingOrRequestingMoneyDiv = document.createElement('div');
    transferingOrRequestingMoneyDiv.setAttribute('id', 'transferingOrRequestingDiv');
    choosingBank.appendChild(transferingOrRequestingMoneyDiv);

    const nameDiv2 = document.createElement('div');
    nameDiv2.setAttribute('id', 'nameDiv2');
    transferingOrRequestingMoneyDiv.appendChild(nameDiv2);

    const nameLabel2 = document.createElement('label');
    nameLabel2.setAttribute('id', 'nameLabel2');
    nameLabel2.innerText = 'His/Her Name : ';
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
    accNoDiv.appendChild(accNoInput);


    if (buttonForTransferingClicked) {
      const applyButtonForTransfering = document.createElement('button');
      applyButtonForTransfering.classList.add('apply-btn', 'apply-transfer');
      applyButtonForTransfering.innerText = 'Apply'
      transferingOrRequestingMoneyDiv.appendChild(applyButtonForTransfering);

      applyButtonForTransfering.addEventListener('click', (e) => {
        const user = onlineUsers();
        if (user.balance < moneyInput2.value) {
          alert('Insufficient balance !!');
          return;
        }
        const inputMoney = - parseFloat(moneyInput2.value);
        transferOrRequest(inputMoney, nameInput2.value, accNoInput.value);
        nameInput2.value = '';
        moneyInput2.value = '';
        accNoInput.value = '';
      });
    }

    if (buttonForRequestingClicked) {
      const applyButtonForRequesting = document.createElement('button');
      applyButtonForRequesting.classList.add('apply-btn', 'apply-request');
      applyButtonForRequesting.innerText = 'Apply'
      transferingOrRequestingMoneyDiv.appendChild(applyButtonForRequesting);

      applyButtonForRequesting.addEventListener('click', () => {
        transferOrRequest(moneyInput2.value, nameInput2.value, accNoInput.value);   
      });
    }
  }


  function transferOrRequest(inputMoney, inputName, accNo) {
    const users = getItem();
    const user = onlineUsers();

    let currentBalance = parseFloat(user.balance);

    if (!inputName || !inputMoney || !accNo) {
      alert('Please fill the form correctly');
      return;
    }

    const matchingUser = users.filter(user => user.accountNo == accNo)[0];   // double equal sign
    if (!matchingUser) {
      alert('This account number is not found in the system');
      return;
    }
    else if (matchingUser.accountNo === user.accountNo) {
      alert('You cannot send money to yourself');
    }
    else {
      if (user.isRequest) {
        matchingUser.balance += inputMoney;   // money input was negative in applyButtonForTransfering clicking
        setItem(matchingUser);
      }

      if (!user.isRequest && buttonForTransferingClicked) {
        currentBalance += inputMoney;
        user.balance = currentBalance;
        matchingUser.balance += - inputMoney;   // money input was negative in applyButtonForTransfering clicking
        setItem(matchingUser);
        setItem(user);

      } else if (!user.isRequest && buttonForRequestingClicked) {
        matchingUser.isRequest = true;
        matchingUser.requestAmount = inputMoney;
        matchingUser.requestAccNo = user.accountNo;
        setItem(matchingUser);
        alert(`${inputMoney}$ request's been sent to the user numbered ${accNo}`);
      }

    }
  }




  // Exit
  function signOut() {
    window.location.href = '../login/index.html';  // or  window.history.back();
    const onlineUser = onlineUsers();
    onlineUser.online = false;
    setItem(onlineUser);
  }




  // Advertisement
  const images = document.getElementById('images');
  const a = document.getElementById('a-tag');
  let i = 0;
  setInterval(() => {
    if (i === 0) {
      images.setAttribute('src', './img/Galaxy S23.jpg');
      a.setAttribute('href', 'https://www.samsung.com/us/smartphones/galaxy-s23/buy/galaxy-s23-256gb-unlocked-sm-s911uzkexaa/')
    } else if (i === 1) {
      images.setAttribute('src', './img/Galaxy Z Fold3 5G.jpg')
      a.setAttribute('href', 'https://www.samsung.com/us/smartphones/galaxy-z-fold3-5g/buy/galaxy-z-fold3-5g-256gb-unlocked-sm-f926uzkaxaa/?modelCode=SM-F926UZKAXAA');
    } else if (i === 2) {
      images.setAttribute('src', './img/Galaxy S21 Ultra 5G.jpg')
      a.setAttribute('href', 'https://www.samsung.com/us/smartphones/galaxy-s-series/certified-re-newed-store/buy/?modelCode=SM5G998UZKAXAA')
    } else if (i === 3) {
      images.setAttribute('src', './img/Galaxy S22 Ultra.jpg')
      a.setAttribute('href', 'https://www.samsung.com/us/smartphones/galaxy-s22-ultra/buy/galaxy-s22-ultra-128gb-unlocked-sm-s908udraxaa/?modelCode=SM-S908UZREXAA');
    }
    if (i === 3) {
      i = -1;
    }
    i++;
  }, 2000);

});

