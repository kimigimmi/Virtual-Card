const largestDiv = document.querySelector('#largestDiv');
const userNameDiv = document.querySelector('#username');
const userInput = document.querySelector('#userInputText');
const passwordDiv = document.querySelector('#password');
const passwordInput = document.querySelector('#passInputText');
const signIn = document.querySelector('#signIn-btn');
const signUp = document.querySelector('#signUp-btn');


/*  DOMContentLoaded, tüm dış kaynaklar (resimler, style sayfaları vb.) 
    tamamen yüklenmesini beklemeden DOM yapısını kullanmaya başlamak için kullanılır.  */
document.addEventListener("DOMContentLoaded", () => {   
    let holdingUserInfos = [];
    holdingUserInfos.push.apply(holdingUserInfos, JSON.parse(localStorage.getItem('userInfos')));
    console.log(holdingUserInfos);
    

    // Sign-in
    function signingIn() {
        return new Promise((resolve, reject) => {
            const users = JSON.parse(localStorage.getItem('userInfos'));
            if (!users || users.length === 0) {
                reject('Username is not found. Please sign up !!!');
            } else {
                const objSeeking = users.find(user => user.username === userInput.value && user.password === passwordInput.value);
                if (objSeeking) {
                    setTimeout(() => {
                        window.location.href = '../account/acc-html.html';
                        const indexOfObj = users.indexOf(objSeeking);
                        users[indexOfObj].online = true;
                        localStorage.setItem('userInfos', JSON.stringify(users));
                        resolve('Sign-in is successful');
                    }, 1000);
                } else {
                    reject('Wrong username or password. Try again');
                }
            }
        });
    }



    // SignUp Dom 
    function signingUp() {
        return new Promise((resolve, reject) => {
            const signUpDiv = document.createElement('div');
            signUpDiv.setAttribute('id', 'signUpDiv');
            largestDiv.appendChild(signUpDiv);

            const userNameDivToSignUp = document.createElement('div');
            userNameDivToSignUp.setAttribute('id', 'username-signUp');
            signUpDiv.appendChild(userNameDivToSignUp);

            const labelUserToSignUp = document.createElement('label');
            labelUserToSignUp.setAttribute('for', 'lblUser-signUp');
            labelUserToSignUp.innerText = 'Username';
            userNameDivToSignUp.appendChild(labelUserToSignUp);

            const colon = document.createElement('span');
            colon.setAttribute('class', 'colonUser');
            colon.innerText = ':';
            labelUserToSignUp.appendChild(colon);

            const userInputToSignUp = document.createElement('input');
            userInputToSignUp.type = 'text';
            userInputToSignUp.setAttribute('class', 'userInputText-signUp input');
            userNameDivToSignUp.appendChild(userInputToSignUp);

            const passwordDivToSignUp = document.createElement('div');
            passwordDivToSignUp.setAttribute("class", "password-signUp  joint-password");
            signUpDiv.appendChild(passwordDivToSignUp);

            const labelPasswordToSignUp = document.createElement('label');
            labelPasswordToSignUp.setAttribute('for', 'lblPass-signUp');
            labelPasswordToSignUp.innerText = 'Password';
            passwordDivToSignUp.appendChild(labelPasswordToSignUp);

            const colonForPass = document.createElement('span');
            colonForPass.setAttribute('class', 'colonPass');
            colonForPass.innerText = ':';
            labelPasswordToSignUp.appendChild(colonForPass);

            const passwordInputToSignUp = document.createElement('input');
            passwordInputToSignUp.type = 'text';
            passwordInputToSignUp.setAttribute('class', 'passInputText-singUp input');
            passwordDivToSignUp.appendChild(passwordInputToSignUp);

            const register = document.createElement('button');
            register.setAttribute('class', 'register-btn btn');
            register.textContent = 'Register';
            signUpDiv.appendChild(register);

            signUp.style.display = 'none';

            register.addEventListener('click', () => {
                creatingUserInfos(resolve, reject, userInputToSignUp, passwordInputToSignUp, signUpDiv);
            });
        });
    }



    // Creating User 
    function creatingUserInfos(resolve, reject, userInputToSignUp, passwordInputToSignUp, signUpDiv) {
        const obj = {};
        obj['username'] = userInputToSignUp.value;
        obj['password'] = passwordInputToSignUp.value;
        obj['online'] = false;
        const accountNo = Math.floor(Math.random() * 10000000);    // 7 digits
        obj['accountNo'] = accountNo;
        obj['balance'] = 0;
        obj['isRequest'] = false;
        obj['requestAmount'] = 0;
        obj['requestAccNo'] = 0;  // Who requests money

        let isExist = false;
        for (let i = 0; i < holdingUserInfos.length; i++) {
            const user = holdingUserInfos[i];
            if (user.username === userInputToSignUp.value || user.accountNo === accountNo) {
                reject('This user already exists');
                isExist = true;
                break;
            }
        }

        if (!isExist) {
            if (userInputToSignUp.value === '' || passwordInputToSignUp.value === '') {
                reject('Please fill the fields');
            } else {
                holdingUserInfos.push(obj);
                localStorage.setItem('userInfos', JSON.stringify(holdingUserInfos));
                signUpDiv.style.display = 'none';
                signUp.style.display = 'inline-block';
                resolve('The user is created');
            }
        }
    }


    // signIn Listener
    signIn.addEventListener('click', () => {
        signingIn()
            .then(successMessage => {
                console.log(successMessage);
            })
            .catch(errMsg => {
                alert(errMsg);
            });
    });
    
    // SignUp Listener
    signUp.addEventListener('click', () => {
        signingUp()
            .then(successMessage => {
                console.log(successMessage);
            })
            .catch(errMsg => {
                console.log(errMsg);
            });
    });


    
});
