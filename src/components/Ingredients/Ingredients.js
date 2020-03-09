import React, { useState, useEffect, useCallback, useReducer } from 'react';
import ErrorModal from  '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
          throw new Error('Should not get here!');
  }
}

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null};
    case 'RESPONSE':
      //This return statement overwrites the spread state with new pair (loading: false)
      return {...currHttpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.errorData};
    case 'CLEAR':
      return {...currHttpState, error: null};
    default: 
      throw new Error('Should not get here!')
  }
} 

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  //const [userIngredients, setUserIngredients] = useState([]);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  // const [error, setError] = useState();
  // const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

  useEffect(()=>{
    console.log('RENDERING INGREDIENTS', userIngredients)
  }, [userIngredients]);

  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'});
    fetch('https://react-hooks-practice-3f0b3.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        dispatchHttp({type: 'RESPONSE'});
        return response.json();
      })
      .then(responseData => {
        // setUserIngredients(prevIngredients => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...ingredient }
        // ]);
        dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
      }).catch(error => {
        dispatchHttp({type: 'ERROR', errorMessage: error.message});
      });
  };

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    //setUserIngredients(filteredIngredients);
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, [])

  const removeIngredientHandler = ingredientId => {
    dispatchHttp({type: 'SEND'});
    fetch(`https://react-hooks-practice-3f0b3.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(response => {
      dispatchHttp({type: 'RESPONSE'});
    dispatch({type: 'DELETE', id: ingredientId})
    // setUserIngredients(prevIngredients =>
    //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
    }).catch(error => {
      dispatchHttp({type: 'ERROR', errorMessage: error.message});
    });
  };

  const clearError = () => {
    dispatch({type: 'CLEAR'})
  };

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal> }
      <IngredientForm loading={httpState.loading} onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
