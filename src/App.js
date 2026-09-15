import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import DashBoard from './tela/DashBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <Link
                to="/DashBoard"
                className="App-link"
                >
                DashBoard
              </Link>
            </header>
          </div>
        }/>
        <Route path="/DashBoard"element={<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
