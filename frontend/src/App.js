import './App.css';
import Home from './pages/Home/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import DisaProduction from './pages/DisaProduction/DisaProduction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/disa' element={<DisaProduction />} />

      </Routes>
    </Router>
  );
}

export default App;
