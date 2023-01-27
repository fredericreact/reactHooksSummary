import React, {useState, useEffect} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const {onLoadedIngredients} = props;

  const [enteredFilter, setEnteredFilter] = useState('')

  useEffect(()=> {
    const query = enteredFilter.length === 0
    ? '' 
    : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch('https://react-http-26861-default-rtdb.firebaseio.com/ingredients.json'+query)
    .then(response => response.json())
    .then(responseData => {
      console.log(responseData)
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id:key,
          title: responseData[key].title,
          amount: responseData[key].amount
        })
      }
      onLoadedIngredients(loadedIngredients)
    })


  }, [enteredFilter, onLoadedIngredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
          type="text" 
          value={enteredFilter}
          onChange ={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
