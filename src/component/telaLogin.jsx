import { useState } from 'react';

function TelaLogin({ onCadastro, onLogin, onEsqueciSenha }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  function entrar() {
    if (!email.includes('@')) {
      setMensagemErro('E-mail inválido. Digite um e-mail com @.');
      return;
    }

    if (senha.trim() === '') {
      setMensagemErro('Digite sua senha.');
      return;
    }

    setMensagemErro('');

    // Envia para o App.jsx
    if (onLogin) {
      onLogin();
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      entrar();
    }
  }

  return (
    <div className="login-container">
      <h1>Login</h1>

      <p>Entre na sua conta InduTime</p>

      {mensagemErro && (
        <p className="mensagem-erro">
          {mensagemErro}
        </p>
      )}

      <div className="form-group">
        <label htmlFor="email">E-mail</label>

        <input
          id="email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="form-group">
        <label htmlFor="senha">Senha</label>

        <input
          id="senha"
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <button
        type="button"
        onClick={entrar}
        className="btn-login"
      >
        Entrar
      </button>

      <button
        type="button"
        onClick={onEsqueciSenha}
        className="btn-link"
      >
        Esqueci minha senha
      </button>

      <div className="cadastro-area">
        <p>Não possui uma conta?</p>

        <button
          type="button"
          onClick={onCadastro}
          className="btn-cadastro"
        >
          Criar conta
        </button>
      </div>
    </div>
  );
}

export default TelaLogin;
