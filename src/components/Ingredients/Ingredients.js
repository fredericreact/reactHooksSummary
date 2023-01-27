import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients)
  },[])

  const addIngredientHandler = ingredient => {
    setIsLoading(true)
    fetch('https://react-http-26861-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}

    }).then(response=> {
      setIsLoading(false)
      return response.json();

    }).then(responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients, 
        {id: responseData.name, ...ingredient}
      ])  
      
    })
    
  }

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true)

    fetch(`https://react-http-26861-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      setIsLoading(false)
      setUserIngredients(prevIngredients => {
        return prevIngredients.filter(ingredient => ingredient.id!==ingredientId)
      })
    }).catch(error=>{
      setError('something went wrong')
      setIsLoading(false)
    })

    
  }

  const clearError = () => {
    setError(null)

  }

  return (
    <div className="App">
    {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
      onAddIngredient={addIngredientHandler}
      loading={isLoading}
      />

      <section>
        <Search onLoadedIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}

export default Ingredients;
