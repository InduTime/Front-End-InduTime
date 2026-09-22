import { useState } from 'react';
import TelaLogin from './component/telaLogin';
import TelaCadastro from './component/telaCadastro';
import EsqueciSenha from './component/esqueciSenha';
import './App.css';

function App() {

  const [tela, setTela] = useState('login');

  return (
    <div className="app">

      <div className="lado-esquerdo">

        <div className="logo">
          ⚙ InduTime
        </div>

            

        <div className="texto-esquerdo">
          <h2>Precisão e controle de tempo para sua manufatura.</h2>

          <p>
            Monitore o tempo de operação de seus tornos CNC em tempo real
            através da nossa rede integrada de sensores IoT.
          </p>
        </div>

        <div className="rodape-esquerdo">
          INDUTIME • TECNOLOGIA INDUSTRIAL
        </div>

      </div>


      <div className="lado-direito">

        <div className="formulario">

          {tela === 'login' && (
            <TelaLogin
              cadastrar={() => setTela('cadastro')}
              esqueciSenha={() => setTela('senha')}
            />
          )}

          {tela === 'cadastro' && (
            <TelaCadastro
              voltar={() => setTela('login')}
            />
          )}

          {tela === 'senha' && (
            <EsqueciSenha
              voltar={() => setTela('login')}
            />
          )}

        </div>

        <div className="copyright">
          © 2026 InduTime. Todos os direitos reservados.
        </div>

      </div>

    </div>
  );
}

export default App;