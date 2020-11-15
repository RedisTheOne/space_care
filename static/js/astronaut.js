let astronautData = {};
let sleepDeclarationId = '';
let astronautNutritionList = [];
let sleepIsAdded = false;

$('.dropdown-menu a.dropdown-toggle').on('click', function(e) {
    if (!$(this).next().hasClass('show')) {
      $(this).parents('.dropdown-menu').first().find('.show').removeClass('show');
    }
    var $subMenu = $(this).next('.dropdown-menu');
    $subMenu.toggleClass('show');
    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
      $('.dropdown-submenu .show').removeClass('show');
    });
    return false;
});

$(".dropdown-item ").on("click", (function(){
    var sel=$(this).text();
    //Get element sent to DB
    if(sel != 'Breakfast 1/2'&& sel !='Lunch' && sel != 'Dinner'){
        document.getElementById('astronautNutritionList').innerHTML += `
            <li class="dropdown-item">${sel}</li>
        `;
        astronautNutritionList.push({
            calories: $(this).attr('id').split('-')[1],
            name: sel
        });
    }
})); 

if(localStorage.getItem('USERNAME')) {
    fetch('/api/users?username=' + localStorage.getItem('USERNAME'))
        .then(res => res.json())
        .then(data => {
            astronautData = data;
            loadValues();
            document.title = `DND | ${localStorage.getItem('USERNAME').toUpperCase()}`
            document.getElementById('loading').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                document.getElementById('astronaut').style.display = 'block';
                document.getElementById('astronaut').style.opacity = '1';
            }, 400);
            //ADD AVATAR IMAGE
            document.getElementById('avatarImg').src = "/images/send?image=" + data.user.avatarPath;
            document.getElementById('astronautName').innerHTML = data.user.firstName + " " + data.user.lastName;
            document.getElementById('astronautSleepGoal').innerHTML = data.user.sleepGoal + " hours of sleep";
            document.getElementById('astronautCalories').innerHTML = data.user.caloriesGoal + " Kcal/day";
        });
} else
    window.location.href = '/signin'

document.getElementById('signOutBtn').addEventListener('click', () => {
    localStorage.removeItem('USERNAME');
    window.location.href = '/signin';
});

function loadValues() {
    fetch('/api/nutrtions/today?username=' + localStorage.getItem('USERNAME'))
        .then(res => res.json())
        .then(data => {
            let nutritionsSum = 0;
            data.nutritions.forEach((n) => {
                nutritionsSum += n.calories;
                document.getElementById("todayNutritionsList").innerHTML += `
                    <li class="list-group-item">${n.nutritionName}</li>
                `
            });
            const percantage = Math.round((nutritionsSum / astronautData.user.caloriesGoal) * 100);
            document.getElementById('nutritionPercantageValue').innerHTML = percantage.toString() + "%";
            document.getElementById('nutritionSum').innerHTML = nutritionsSum.toString() + " Kcal";
            if(percantage > 0) {
                if (percantage > 100) {
                    document.getElementById('nutritionRight').style.transform = `rotate(180deg)`;
                    document.getElementById('nutritionLeft').style.transform = `rotate(180deg)`;
                } else if(percantage > 50) {
                    document.getElementById('nutritionRight').style.transform = `rotate(180deg)`;
                    document.getElementById('nutritionLeft').style.transform = `rotate(${(percantage - 50) * 3.6}deg)`;
                } else {
                   document.getElementById('nutritionRight').style.transform = `rotate(${percantage * 3.6}deg)` 
                }
            }
        });
    
    fetch('/api/sleep/today?username=' + localStorage.getItem('USERNAME'))
        .then(res => res.json())
        .then(data => {
            sleepDeclarationId = data.sleepDeclaration._id;
            let sleepSum = 0;
            let sleepPercantage = 0;
            if(data.sleepDeclaration.hours) {
                sleepIsAdded = true;
                sleepSum = data.sleepDeclaration.hours;
                sleepPercantage = Math.round((sleepSum / astronautData.user.sleepGoal) * 100);
            }
            document.getElementById('sleepPercantageValues').innerHTML = `${sleepPercantage}%`;
            document.getElementById('sleepSum').innerHTML = `${sleepSum} hours`;
            document.getElementById('sleepInput').value = sleepSum;
            if(sleepPercantage > 0) {
                if(sleepPercantage > 100) {
                    document.getElementById('sleepRight').style.transform = `rotate(180deg)`;
                    document.getElementById('sleepLeft').style.transform = `rotate(180deg)`;
                } else if(sleepPercantage > 50) {
                    document.getElementById('sleepRight').style.transform = `rotate(180deg)`;
                    document.getElementById('sleepLeft').style.transform = `rotate(${(sleepPercantage - 50) * 3.6}deg)`;
                } else {
                    document.getElementById('sleepRight').style.transform = `rotate(${sleepPercantage * 3.6}deg)`;
                }
            }
        });
}

document.getElementById('sleepButton').addEventListener('click', () => {
    let hours = document.getElementById('sleepInput').value;
    document.getElementById('sleepButton').innerHTML = 'Loading...';
    if(sleepIsAdded) {
        fetch('/api/edit/sleep', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: sleepDeclarationId, hours})
        })
            .then(res => res.json())
            .then(data => {
                window.location.reload();
            })
    } else {
        console.log(1)
        const date = new Date();
        fetch('/api/add/sleepdeclaration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: localStorage.getItem('USERNAME'), hours, month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear()})
        })
            .then(res => res.json())
            .then(data => {
                window.location.reload();
            })
    }
})

document.getElementById('nutritionButton').addEventListener('click', () => {
    document.getElementById('nutritionButton').innerHTML = "Loading...";
    const promises = [];
    let date = new Date();
    astronautNutritionList.forEach((a) => {
        promises.push(fetch('/api/add/nutrition', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: localStorage.getItem('USERNAME'), nutritionName: a.name, calories: parseInt(a.calories), day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()})
        }).then(res => res.json()));
    });
    Promise.all(promises)
        .then(() => window.location.reload())
})