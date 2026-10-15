function EsqueciSenha({ voltar }) {

  return (
    <div>
      <h1>Alterar senha</h1>

      <input
        type="email"
        placeholder="Digite seu e-mail"
      />

      <br />

      <input
        type="password"
        placeholder="Nova senha"
      />

      <br />

      <input
        type="password"
        placeholder="Confirme sua nova senha"
      />

      <br />

      <button>
        Alterar senha
      </button>

      <br />

      <button onClick={voltar}>
        Voltar para Login
      </button>
    </div>
  );
}

export default EsqueciSenha;