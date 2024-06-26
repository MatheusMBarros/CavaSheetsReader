import './App.css';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DisaProduction from './pages/DisaProduction/DisaProduction';
import ProductionAndAluminiumLost from './pages/ProductionAndAluminiumLost/ProductionAndAluminiumLost';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/producaoPorOperador' element={<DisaProduction />} />
        <Route path='/moldes' element={<ProductionAndAluminiumLost/>} />
      </Routes>
    </Router>
  );
}

export default App;
