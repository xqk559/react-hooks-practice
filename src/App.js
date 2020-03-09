import React, {useContext} from 'react';
import Auth from './components/Auth';
import Ingredients from './components/Ingredients/Ingredients';
import AuthContextProvider, {AuthContext} from './context/auth-context';

const App = props => {
  const authContext = useContext(AuthContext);


  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Ingredients />;
  }

  return (
  <div>
    {content}
  </div>);
  };

export default App;
