import React, { useState, useMemo, useEffect, useCallback, useReducer } from 'react';
import ErrorModal from  '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import useHttp from '../../hooks/http';


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

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  //const [userIngredients, setUserIngredients] = useState([]);
  // const [error, setError] = useState();
  // const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});

  const {isLoading, error, data, sendRequest} = useHttp();

  useEffect(()=>{
    console.log('RENDERING INGREDIENTS', userIngredients)
  }, [userIngredients]);

  const addIngredientHandler = useCallback(ingredient => {})
  //   dispatchHttp({type: 'SEND'});
  //   fetch('https://react-hooks-practice-3f0b3.firebaseio.com/ingredients.json', {
  //     method: 'POST',
  //     body: JSON.stringify(ingredient),
  //     headers: { 'Content-Type': 'application/json' }
  //   })
  //     .then(response => {
  //       dispatchHttp({type: 'RESPONSE'});
  //       return response.json();
  //     })
  //     .then(responseData => {
  //       // setUserIngredients(prevIngredients => [
  //       //   ...prevIngredients,
  //       //   { id: responseData.name, ...ingredient }
  //       // ]);
  //       dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
  //     }).catch(error => {
  //       dispatchHttp({type: 'ERROR', errorMessage: error.message});
  //     });
  // }, )

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, [])

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hooks-practice-3f0b3.firebaseio.com/ingredients/${ingredientId}.json`, 'DELETE')
  },[sendRequest])

  const clearError = useCallback(() => {
    dispatch({type: 'CLEAR'})
  }, []);

  const ingredientList = useMemo(()=> {
    return <IngredientList
              ingredients={userIngredients}
              onRemoveItem={removeIngredientHandler}
           />
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal> }
      <IngredientForm loading={isLoading} onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
