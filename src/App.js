import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import addNote from './components/Notes'
import './styles/css/style.css'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={addNote}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
