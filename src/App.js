import { useState } from 'react';
import TelaLogin from './component/telaLogin';
import TelaCadastro from './component/telaCadastro';
import EsqueciSenha from './component/esqueciSenha';

function App() {

  const [tela, setTela] = useState('login');

  return (
    <div>

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
  );
}

export default App;