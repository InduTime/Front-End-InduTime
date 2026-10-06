
import { useState } from 'react';
import { Link } from 'react-router-dom';

function TelaLogin({ cadastrar, esqueciSenha }) {

  const [mensagemErro, setMensagemErro] = useState('');

  function verific(f) {
    const valor = f.target.value;

    if (!valor.includes('@')) {
      setMensagemErro('E-mail inválido. Digite um e-mail com @.');
      return false;
    }

    setMensagemErro('');
    return true;
  }

  function email(f) {
    if (f.key === 'Enter') {
      entrar();
    }
  }

  function entrar() {
    const campoEmail = document.querySelector('input[type="email"]');

    if (!verific({ target: campoEmail })) {
      return;
    }

    alert('E-mail cadastrado com sucesso!');
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="E-mail"
        onChange={verific}
        onKeyDown={email}
      />

      {mensagemErro && (
        <p>{mensagemErro}</p>
      )}

      <br />

      <input
        type="password"
        placeholder="Senha"
      />

      <br />

      <Link
            to="/DashBoard"
            className="App-link"
            >
              <button onClick={entrar} style={{ "margin-bottom": "8px" }}>Entrar</button>  
      </Link>

      <br />

      <button onClick={esqueciSenha}>
        Esqueci minha senha
      </button>

      <p>Não possui uma conta?</p>

      <button onClick={cadastrar}>
        Criar cadastro
      </button>

    </div>
  );
}

export default TelaLogin;

