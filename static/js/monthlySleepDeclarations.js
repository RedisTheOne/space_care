let astronautData = {}

if(localStorage.getItem('USERNAME')) {
    const data = new Date();
    fetch(`/api/sleepdeclarations/monthly?username=${localStorage.getItem('USERNAME')}&month=${data.getMonth() + 1}&year=${data.getFullYear()}`)
        .then(res => res.json())
        .then(data => {
            astronautData = data;
            console.log(data)
            document.title = `DND | ${localStorage.getItem('USERNAME').toUpperCase()}`
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('monthlySleepDeclarations').style.display = 'block';
                document.getElementById('monthlySleepDeclarations').style.opacity = '1';
            }, 400);
            const sleepDeclarationsList = document.getElementById('sleepDeclarationsList');
            document.getElementById('header').innerHTML = `MONTHLY SLEEP DECLARATIONS | ${data.sleepDeclarations.length}`
            data.sleepDeclarations.forEach(d => {
                sleepDeclarationsList.innerHTML += `<li class='list-group-item'>On ${d.day}/${d.month}/${d.year} you have slept ${d.hours} hours</li>`
            });
        });
} else
    window.location.href = '/signin'