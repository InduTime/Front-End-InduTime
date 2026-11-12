import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TelaLogin({ cadastrar, esqueciSenha }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function entrar() {
    setMensagemErro('');

    if (!email.includes('@')) {
      setMensagemErro('E-mail inválido.');
      return;
    }

    if (!senha) {
      setMensagemErro('Digite sua senha.');
      return;
    }

    setCarregando(true);

    try {
      // Como não há rota de autenticação real, verificamos se o usuário existe
      const res = await fetch(`http://10.110.12.57:8080/usuarios/email/${encodeURIComponent(email)}`);
      
      if (!res.ok) {
        // Se der erro 500 (Usuário não encontrado segundo a doc), consideramos login inválido
        setMensagemErro('E-mail ou senha incorretos.');
        setCarregando(false);
        return;
      }

      // Se passou, o usuário existe. Vamos para o DashBoard!
      navigate('/DashBoard');
    } catch (error) {
      setMensagemErro('Erro de conexão. A API está rodando?');
    } finally {
      setCarregando(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') entrar();
  }

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <br />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <br />

      {mensagemErro && <p style={{ color: 'red' }}>{mensagemErro}</p>}
      <br />

      <button onClick={entrar} disabled={carregando} style={{ marginBottom: '8px' }}>
        {carregando ? 'Entrando...' : 'Entrar'}
      </button> 
      <br />

      <button onClick={esqueciSenha} disabled={carregando}>
        Esqueci minha senha
      </button>

      <p>Não possui uma conta?</p>

      <button onClick={cadastrar} disabled={carregando}>
        Criar cadastro
      </button>
    </div>
  );
}

export default TelaLogin;