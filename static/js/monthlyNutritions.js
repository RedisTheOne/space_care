let astronautData = {}

if(localStorage.getItem('USERNAME')) {
    const data = new Date();
    fetch(`/api/nutritions/monthly?username=${localStorage.getItem('USERNAME')}&month=${data.getMonth() + 1}&year=${data.getFullYear()}`)
        .then(res => res.json())
        .then(data => {
            astronautData = data;
            console.log(data)
            document.title = `DND | ${localStorage.getItem('USERNAME').toUpperCase()}`
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('monthlyNutritions').style.display = 'block';
                document.getElementById('monthlyNutritions').style.opacity = '1';
            }, 400);
            const monthlyNutritionsList = document.getElementById('monthlyNutritionsList');
            document.getElementById('header').innerHTML = `MONTHLY NUTRITIONS | ${data.monthlyNutritions.length}`
            data.monthlyNutritions.forEach(d => {
                monthlyNutritionsList.innerHTML += `<li class='list-group-item'>On ${d.day}/${d.month}/${d.year} you have consumed ${d.calories} calories by eating ${d.nutritionName}</li>`
            });
        });
} else
    window.location.href = '/signin'