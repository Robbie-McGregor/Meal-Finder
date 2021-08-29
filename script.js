const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal')


//Search meal and fetch from API
function searchMeal(e){
    e.preventDefault()

    //Clear single meal
    single_mealEl.innerHTML = ''

    //Get the search term
    const term = search.value

    //Check for empty
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h2>Search Results for: ${term}</h2>`
                displaySearchMeals(data.meals)
            })



    } else {
        alert('Please enter a search term')
    }

}

function displaySearchMeals(meals){
    if (meals === null){
        resultHeading.innerHTML = '<p>There are no search results. Try again</p>'

    } else {

        mealsEl.innerHTML = ''
        meals.forEach(meal => {
        const element = document.createElement('div')
        element.onclick = 'getSingleMeal()'
        element.setAttribute('onclick', `getSingleMeal(${meal.idMeal})`) 
        element.classList.add('meal')
        element.innerHTML = `
            <img src='${meal.strMealThumb}'>
            <h3>${meal.strMeal}</h3>
        `
        mealsEl.appendChild(element)
        })
    }
}
function getSingleMeal(id){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data => {
            meal = data.meals[0]
            let ingredients = []
            console.log(meal)

            for (i = 1; i <= 20; i++){
                if (meal[`strIngredient${i}`] !== '' && meal[`strIngredient${i}`] !== null){
                    ingredients[i] = {
                        ingredient: meal[`strIngredient${i}`],
                        measurement: meal[`strMeasure${i}`]
                    }
                }
            }
            console.log(ingredients)
            let ingredientList = ''
            ingredients.forEach(ingredient => {
                ingredientList += `<li><span>${ingredient.ingredient}</span><span>${ingredient.measurement}</span></li>`
            })
            
            const element = document.createElement('div')
            element.classList.add('single-meal')
            element.innerHTML = `
                <h2>${meal.strMeal}</h2>
                <img src=${meal.strMealThumb}>
                <h3>Ingredients:</h3>
                <ul class='ingredients'>
                    ${ingredientList}
                </ul>
                <p>${meal.strInstructions}</p>
            `
            single_mealEl.innerHTML = ''
            single_mealEl.appendChild(element)

            single_mealEl.scrollIntoView()
        })
}


//event listeners
submit.addEventListener('submit', searchMeal)
