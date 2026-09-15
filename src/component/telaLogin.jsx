function TelaLogin({ cadastrar, esqueciSenha }) {

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="E-mail"
      />

      <br />

      <input
        type="password"
        placeholder="Senha"
      />

      <br />

      <button>Entrar</button>

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