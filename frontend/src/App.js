import React, { useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SingupFormPage from './components/SignupFormPage';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import SpotDetails from './components/SpotDetail'
import Spots from './components/Spots';
import CreateSpot from './components/CreateSpot';


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    <Navigation isLoaded={isLoaded} />
    {isLoaded && (
      <Switch>
        <Route exact path='/'>
          <Spots />
        </Route>
        <Route exact path='/spots/new'>
          <CreateSpot />
          </Route>
        <Route path='/spots/:spotId' spot={SpotDetails}>
          <SpotDetails />
        </Route>
    </Switch>
      )}
    </>
  );
}

export default App;
