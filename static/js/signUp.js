if(localStorage.getItem('USERNAME'))
    window.location.href = '/astronaut';

const signUpBtn = document.getElementById('signUpBtn');
const firstNameInput = document.getElementById('firstNameInput');
const lastNameInput = document.getElementById('lastNameInput');
const sleepGoalInput = document.getElementById('sleepGoalInput');
const caloriesGoalInput = document.getElementById('caloriesGoalInput');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const avatarInput = document.getElementById('avatarInput');

document.getElementById('avatarBtn').addEventListener('click', () => {
    document.getElementById('avatarInput').click();
});
avatarInput.addEventListener('input', function(){
    document.getElementById('avatarBtn').classList.add('checked');
})

signUpBtn.addEventListener('click', () => {
    signUpBtn.innerHTML = "LOADING..."
    if(document.getElementById('avatarInput').files[0]) {
        const formData = new FormData();
        formData.append('lastName', lastNameInput.value);
        formData.append('firstName', firstNameInput.value);
        formData.append('sleepGoal', sleepGoalInput.value);
        formData.append('username', usernameInput.value);
        formData.append('password', passwordInput.value);
        formData.append('caloriesGoal', caloriesGoalInput.value);
        formData.append('avatar', document.getElementById('avatarInput').files[0])
        fetch('/api/signup', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                signUpBtn.innerHTML = "GO";
                if(data.status) {
                    localStorage.setItem('USERNAME', usernameInput.value);
                    window.location.href = '/astronaut';
                } else
                    M.toast({
                        html: "Error: Username is already taken."
                    })
            });
    } else {
        signUpBtn.innerHTML = "GO";
        M.toast({
            html: "Error: Please add an avatar image."
        })
    }
});