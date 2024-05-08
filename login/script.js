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
    getUsers()
        .then(users => {
            holdingUserInfos = users;
            console.log(holdingUserInfos);
            // SignUp Listener
            signUp.addEventListener('click', (e) => {
                signingUp(e)
                    .then(successMessage => {
                        console.log(successMessage);
                    })
                    .catch(errMsg => {
                        console.log(errMsg);
                    });
            });


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


        }).catch(error => {
            console.error('Error fetching users:', error);
            throw error;
        });





    async function getUsers() {
        try {
            const response = await fetch('http://localhost:3000/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();   // Bu işlemde parse... edilir. JSON formatındaki veriler, JavaScript nesnelerine dönüştürülmesi için bu yöntem kullanılır.
            return data;
        } catch (error) {
            console.error('Error fetching users from db:', error);
            throw error;
        }
    }


    async function addUser(user) {
        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                throw new Error('Failed to add user');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users to db:', error);
            throw error;
        }
    }


    async function updateUser(userId, newData) {
        try {
            const response = await fetch(`http://localhost:3000/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            const updateUser = await response.json();
            return updateUser;
         } catch(error){
             console.error('Error updating user:', error);
             throw error;
         }
    }


    // Sign-in
    function signingIn() {
        return new Promise((resolve, reject) => {
            const users = holdingUserInfos;
            if (!users || users.length === 0) {
                reject('Username is not found. Please sign up !!!');
            } else {
                const objSeeking = users.find(user => user.username === userInput.value && user.password === passwordInput.value);
                if (objSeeking) {
                    setTimeout(() => {
                        window.location.href = '../account/acc-html.html';
                        const indexOfObj = users.indexOf(objSeeking);
                        const updatedData = {'online' : true };
                        const userId = users[indexOfObj].id; 
                         
                        updateUser(userId, updatedData);

                        resolve('Sign-in is successful');
                    }, 1000);
                } else {
                    reject('Wrong username or password. Try again');
                }
            }
        });
    }






    // SignUp Dom 
    async function signingUp(e) {
        e.preventDefault();
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

        return new Promise((resolve, reject) => {
            register.addEventListener('click', async () => {
                try {
                    await creatingUserInfos(userInputToSignUp, passwordInputToSignUp, signUpDiv)
                        .then(successMsg => {
                            resolve(successMsg)
                        }).catch(errMsg => {
                            reject(errMsg)
                        })
                } catch (error) {
                    reject(error);
                }
            });
        });
    }



    // Creating User 
    async function creatingUserInfos(userInputToSignUp, passwordInputToSignUp, signUpDiv) {
        try {
            const obj = {
                username: userInputToSignUp.value,
                password: passwordInputToSignUp.value,
                online: false,
                accountNo: Math.floor(Math.random() * 10000000), // 7 digits
                balance: 0,
                isRequest: false,
                requestAmount: 0,
                requestAccNo: 0
            };

            const isExist = holdingUserInfos.some(user => user.username === obj.username || user.accountNo === obj.accountNo);
            if (isExist) {
                throw new Error('This user already exists');
            }

            if (obj.username === '' || obj.password === '') {
                throw new Error('Please fill the fields');
            }

            const newUser = await addUser(obj);
            holdingUserInfos.push(newUser);
            signUpDiv.style.display = 'none';
            signUp.style.display = 'inline-block';
            return 'The user is created';
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }


});
