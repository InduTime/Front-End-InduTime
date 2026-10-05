import { useState } from 'react';

function TelaCadastro({ voltar }) {

  const [mensagemErro, setMensagemErro] = useState('');

  function verificarEmail(e) {
    const valor = e.target.value;

    if (!valor.includes('@')) {
      setMensagemErro('E-mail inválido. Digite um e-mail com @.');
      return false;
    }

    setMensagemErro('');
    return true;
  }

  function email(e) {
    if (e.key === 'Enter') {
      verificarEmail(e);
    }
  }

  function cadastrar() {
    const campoEmail = document.querySelector('input[type="email"]');

    if (!verificarEmail({ target: campoEmail })) {
      return;
    }

    alert('Cadastro realizado com sucesso!');
  }

  return (
    <div>
      <h1>Cadastro</h1>

      <input
        type="text"
        placeholder="Nome"
      />

      <br />

      <input
        type="email"
        placeholder="E-mail"
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

      <button onClick={cadastrar}>
        Cadastrar
      </button>

      <button onClick={voltar}>
        Voltar para Login
      </button>

    </div>
  );
}

export default TelaCadastro;

