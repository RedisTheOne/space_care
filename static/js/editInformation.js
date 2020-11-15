if(localStorage.getItem('USERNAME')) {
    fetch(`/api/users?username=${localStorage.getItem('USERNAME')}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 400);
            document.getElementById('firstName').value = data.user.firstName;
            document.getElementById('lastName').value = data.user.lastName;
            document.getElementById('sleepGoal').value = data.user.sleepGoal;
            document.getElementById('caloriesGoal').value = data.user.caloriesGoal;
        });

    document.getElementById('editInformationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const sleepGoal = document.getElementById('sleepGoal').value;
        const caloriesGoal = document.getElementById('caloriesGoal').value;
        if(/\S/.test(firstName) && /\S/.test(lastName) && sleepGoal > 4 && caloriesGoal > 1400) {
            fetch('/api/edit/userinformation', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({firstName, lastName, sleepGoal, caloriesGoal, username: localStorage.getItem('USERNAME')})
            })
                .then(res => res.json())
                .then(data => {
                    alert('Information updated successfully.')
                });
        } else
            alert('Please fill required fields.')
    })
} else
    window.location.href = '/signin';