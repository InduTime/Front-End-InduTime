import { useState } from 'react';
import { API_URL } from '../services/api';

function TelaCadastro({ voltar }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function cadastrar() {
    setMensagemErro('');

    if (!nome || !email || !senha) {
      setMensagemErro('Preencha todos os campos.');
      return;
    }

    if (!email.includes('@')) {
      setMensagemErro('E-mail inválido. Digite um e-mail com @.');
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      if (!res.ok) {
        const erro = await res.json();
        // A API retorna 500 para e-mail já cadastrado, ou 400 para validações
        setMensagemErro(erro.message || 'Erro ao realizar cadastro.');
        setCarregando(false);
        return;
      }

      alert('Cadastro realizado com sucesso!');
      voltar(); // Volta para a tela de login
    } catch (error) {
      setMensagemErro('Erro de conexão. Verifique se a API está rodando e o CORS.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <h1>Cadastro</h1>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <br />

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />
      <br />

      {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>}
      <br />

      <button onClick={cadastrar} disabled={carregando}>
        {carregando ? 'Cadastrando...' : 'Cadastrar'}
      </button>

      <button onClick={voltar} disabled={carregando}>
        Voltar para Login
      </button>
    </div>
  );
}

export default TelaCadastro;