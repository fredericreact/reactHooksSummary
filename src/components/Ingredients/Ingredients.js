import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([])

  useEffect(()=>{
    fetch('https://react-http-26861-default-rtdb.firebaseio.com/ingredients.json')
    .then(response => response.json())
    .then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id:key,
          title: responseData[key].title,
          amount: responseData[key].amount
        })
      }
      setUserIngredients(loadedIngredients)
    })
  }, [])


  const filteredIngredientsHandler = filteredIngredients => {
    setUserIngredients(filteredIngredients)
  }

  const addIngredientHandler = ingredient => {

    fetch('https://react-http-26861-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}

    }).then(response=> {
      return response.json();

    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: responseData.name, ...ingredient}
      ])  
      
    })
    
  }

  const removeIngredientHandler = (ingredientId) => {
    console.log(ingredientId)
    setUserIngredients(prevIngredients => {
      return prevIngredients.filter(ingredient => ingredient.id!==ingredientId)
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadedIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
