function TelaCadastro({ voltar }) {

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
      />

      <br />

      <input
        type="password"
        placeholder="Senha"
      />

      <br />

      <button>Cadastrar</button>

      <button onClick={voltar}>
        Voltar para Login
      </button>

    </div>
  );
}

export default TelaCadastro;