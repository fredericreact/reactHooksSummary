# react Hooks summary

## send http request 

### POST

```javascript
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

```

### GET

```javascript
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



```

## Search

```javascript
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



```

Firebase provide a search query , we need to :
- Modify the rules in Firebase
- create the query in fetch

![image](https://user-images.githubusercontent.com/104289891/215238195-6ec37bbb-8040-40bf-bb5a-777c586acb59.png)

We need to add onLoadedIngredients as a dependency

But there is an infinite loop because when Search is loaded, it will call filteredIngredientsHandler which changes the state so it will make the whole Ingredients component re-render, so there will be a new version of filteredIngredientsHandler function so it will re-render the Search component which will call the filteredIngredientsHandler again and so on…

Here, we need to add useCallback, to make the filteredIngredientsHandler function not to re-render.
 
```javascript
import React, {useState, useEffect, useCallback} from 'react';


import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'


const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([])


  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients)
  },[])


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
```



## useRef

```javascript
import React, {useState, useEffect, useRef} from 'react';


import Card from '../UI/Card';
import './Search.css';


const Search = React.memo(props => {


  const {onLoadedIngredients} = props;


  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef=useRef();


  useEffect(()=> {


    const timer =  setTimeout(() => {


      if (enteredFilter === inputRef.current.value){
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


      }


    }, 500);


   
    return () => {
      clearTimeout(timer)
    }


  }, [enteredFilter, onLoadedIngredients, inputRef])


  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
          ref={inputRef}
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



```

### send http request : DELETE

```javascript
import React, {useState, useEffect, useCallback} from 'react';


import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'


const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([])


  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients)
  },[])


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




    fetch(`https://react-http-26861-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      setUserIngredients(prevIngredients => {
        return prevIngredients.filter(ingredient => ingredient.id!==ingredientId)
      })
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



```

## useReducer


```javascript
import React, {useReducer, useEffect, useCallback} from 'react';


import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'


const ingredientReducer = (currentIngredients, action) => {
switch (action.type) {
  case 'SET':
    return action.ingredients;
  case 'ADD':
    return [...currentIngredients, action.ingredient]
  case 'DELETE':
    return currentIngredients.filter(ing => ing.id !== action.id)
  default:
  throw new Error('Should not get there')


}
}


const httpReducer = (curhttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE' :
    return {...curhttpState, loading:false}
    case 'ERROR':
    return {loading:false, error:action.errorMessage}
    case 'CLEAR':
      return {...curhttpState, error: null}
    default:
      throw new Error('Should not be reached')
  }
}


const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer,[])
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error:null})
  // const [userIngredients, setUserIngredients] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState()


  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients)
    dispatch({type: 'SET', ingredients:filteredIngredients})
  },[])


  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'})
    fetch('https://react-http-26861-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}


    }).then(response=> {
      dispatchHttp({type:'RESPONSE'})
      return response.json();


    }).then(responseData => {
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   {id: responseData.name, ...ingredient}
      // ])  
      dispatch({type: 'ADD', ingredient:{id: responseData.name, ...ingredient}})
     
    })
   
  }


  const removeIngredientHandler = (ingredientId) => {
    dispatchHttp({type:'SEND'})


    fetch(`https://react-http-26861-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      dispatchHttp({type:'REPONSE'})
      // setUserIngredients(prevIngredients => {
      //   return prevIngredients.filter(ingredient => ingredient.id!==ingredientId)
      // })
      dispatch({type: 'DELETE', id: ingredientId})
    }).catch(error=>{
      dispatchHttp({type: 'ERROR', errorMessage:'Something went wrong'})
    })


   
  }


  const clearError = () => {
    dispatchHttp({type:'CLEAR'})


  }


  return (
    <div className="App">
    {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm
      onAddIngredient={addIngredientHandler}
      loading={httpState.loading}
      />


      <section>
        <Search onLoadedIngredients={filteredIngredientsHandler}/>
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>
      </section>
    </div>
  );
}


export default Ingredients;



```

## useContext

- Provide

```javascript
import React, {useState} from 'react';


export const AuthContext = React.createContext({
    isAuth: false,
    login: ()=> {}
})


const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)


    const loginHandler = () => {
        setIsAuthenticated(true)
    }


    return (
        <AuthContext.Provider value={{login: loginHandler, isAuth: isAuthenticated}}>
            {props.children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider

```

```javascript
import React from 'react';
import ReactDOM from 'react-dom';


import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<AuthContextProvider>
<App />
</AuthContextProvider>);



```

- Use

```javascript
import React, {useContext} from 'react';


import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth'
import {AuthContext} from './context/auth-context'


const App = props => {
  const authContext = useContext(AuthContext)


  let content = <Auth/>
  if (authContext.isAuth) {
    content = <Ingredients/>
  }
  return content;
};


export default App;



```

```javascript
import React, {useContext} from 'react';


import Card from './UI/Card';
import {AuthContext} from '../context/auth-context'
import './Auth.css';


const Auth = props => {
  const authContext = useContext(AuthContext)
  const loginHandler = () => {
    authContext.login();
  };


  return (
    <div className="auth">
      <Card>
        <h2>You are not authenticated!</h2>
        <p>Please log in to continue.</p>
        <button onClick={loginHandler}>Log In</button>
      </Card>
    </div>
  );
};


export default Auth;



```

## custom Hooks




```javascript
import {useReducer, useCallback} from 'react'


const initialState = {
 
        loading: false,
        error:null,
        data: null,
        extra: null,
        identifier: null
   
}


const httpReducer = (curhttpState, action) => {
    switch (action.type) {
      case 'SEND':
        return {loading: true, error: null, data:null, extra: null, identifier: action.identifier};
      case 'RESPONSE' :
      return {...curhttpState, loading:false, data: action.responseData, extra:action.extra}
      case 'ERROR':
      return {loading:false, error:action.errorMessage}
      case 'CLEAR':
        return initialState
     
      default:
        throw new Error('Should not be reached')
    }
  }
 


const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer,initialState)


    const clear = useCallback(()=>dispatchHttp({type:'CLEAR'}), [])


    const sendRequest = useCallback((url, method,body, reqExtra, reqIdentifier) => {
        dispatchHttp({type:'SEND', identifier: reqIdentifier})
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
          }).then(response => {
            return response.json()
       
          })
          .then(responseData => {
            dispatchHttp({type: 'RESPONSE', responseData: responseData, extra:reqExtra})
          })
          .catch(error=>{
            dispatchHttp({type: 'ERROR', errorMessage:'Something went wrong'})
          })


    },[])


    return {
        isLoading:httpState.loading,
        data: httpState.data,
        error:httpState.error,
        sendRequest:sendRequest,
        reqExtra: httpState.extra,
       reqIdentifier: httpState.identifier,
       clear:clear
    };


}


export default useHttp







```

```javascript
import React, {useReducer, useEffect, useCallback, useMemo} from 'react';


import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hooks/http'


const ingredientReducer = (currentIngredients, action) => {
switch (action.type) {
  case 'SET':
    return action.ingredients;
  case 'ADD':
    return [...currentIngredients, action.ingredient]
  case 'DELETE':
    return currentIngredients.filter(ing => ing.id !== action.id)
  default:
  throw new Error('Should not get there')


}
}




const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer,[])
 const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear}=useHttp()




  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id:reqExtra})
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredient:{id: data.name, ...reqExtra}})
    }
   
  }, [data, reqExtra, reqIdentifier, isLoading])


  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients:filteredIngredients})
  },[])


  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-http-26861-default-rtdb.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
 
   
  },[sendRequest]);


  const removeIngredientHandler = useCallback((ingredientId) => {


sendRequest(
  `https://react-http-26861-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
  'DELETE',
  null,
  ingredientId,
  'REMOVE_INGREDIENT'
  )
  },[sendRequest])






  const ingredientList = useMemo(()=>{
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler}/>


  }, [userIngredients,removeIngredientHandler])


  return (
    <div className="App">
    {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm
      onAddIngredient={addIngredientHandler}
      loading={isLoading}
      />


      <section>
        <Search onLoadedIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}


export default Ingredients;



```

```javascript
import React, {useState, useEffect, useRef} from 'react';
import ErrorModal from '../UI/ErrorModal'
import Card from '../UI/Card';
import useHttp from '../../hooks/http'
import './Search.css';


const Search = React.memo(props => {


  const {onLoadedIngredients} = props;


  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef=useRef();
  const {isLoading, data, error, sendRequest, clear} = useHttp()


  useEffect(()=> {


    const timer =  setTimeout(() => {


      if (enteredFilter === inputRef.current.value){
        const query = enteredFilter.length === 0
        ? ''
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest('https://react-http-26861-default-rtdb.firebaseio.com/ingredients.json'+query, 'GET')
       
         


      }


    }, 500);


   
    return () => {
      clearTimeout(timer)
    }


  }, [enteredFilter, sendRequest, inputRef])


  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
          for (const key in data) {
            loadedIngredients.push({
              id:key,
              title: data[key].title,
              amount: data[key].amount
            })
          }
          onLoadedIngredients(loadedIngredients)
       
    }
  }, [data, isLoading,error, onLoadedIngredients])


  return (
    <section className="search">
    {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input
          ref={inputRef}
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



```
