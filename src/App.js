import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import DashBoard from './tela/DashBoard';
import Historico from './tela/Historico';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <Link to="/DashBoard" className="App-link">DashBoard</Link>
              <Link to="/Historico" className="App-link">Histórico</Link>
            </header>
          </div>
        }/>
        <Route path="/DashBoard"element={<DashBoard/>}/>
        <Route path="/Historico"element={<Historico/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
