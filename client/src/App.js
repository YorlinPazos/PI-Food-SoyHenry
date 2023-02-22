import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import NavBar from './components/NavBar';
function App() {

  return (
    <BrowserRouter>
    <NavBar/>
    <div className="App">
      <h1>Food App</h1>
    </div>
    </BrowserRouter>
  );
}

export default App;
