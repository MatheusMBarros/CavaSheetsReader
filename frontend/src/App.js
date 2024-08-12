import './App.css';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DisaProduction from './pages/DisaProduction/DisaProduction';
import ProductionAndAluminiumLost from './pages/ProductionAndAluminiumLost/ProductionAndAluminiumLost';
import SelectProduction from './pages/CorteCanal/SelectProduction';
import PalletDetails from './components/PalletDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/producaoPorOperador' element={<DisaProduction />} />
        <Route path='/moldes' element={<ProductionAndAluminiumLost />} />
        <Route path='/corteCanal' element={<SelectProduction />} />
        <Route path="/lote/:id" element={<PalletDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
