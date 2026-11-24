
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../services/api';

async function lerResposta(res) {
  let corpo;
  try {
    corpo = await res.text();
  } catch {
    return null;
  }

  if (!corpo.trim()) return null;

  try {
    const dados = JSON.parse(corpo);
    return typeof dados === 'string' ? { message: dados } : dados;
  } catch {
    return { message: corpo.trim() };
  }
}

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
      let res;
      try {
        res = await fetch(`${API_URL}/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), senha })
        });
      } catch (error) {
        console.error('Erro no login:', error);
        setMensagemErro('Erro de conexão. A API está rodando?');
        return;
      }

      const usuario = await lerResposta(res);

      if (res.status !== 200) {
        setMensagemErro(
          typeof usuario?.message === 'string' && usuario.message.trim()
            ? usuario.message
            : 'E-mail ou senha incorretos.'
        );
        return;
      }

      if (!usuario || typeof usuario !== 'object' || Array.isArray(usuario)) {
        setMensagemErro('Não foi possível validar os dados retornados pelo servidor.');
        return;
      }

      try {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        setMensagemErro('Não foi possível salvar os dados do usuário.');
        return;
      }

      navigate('/DashBoard');
    } finally {
      setCarregando(false);
    }
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter') entrar();
  }

  return (
    <div className="authConteudo">
      <span className="authEyebrow">ÁREA DO CLIENTE</span>
      <h1>Bem-vindo de volta</h1>
      <p className="authDescricao">Entre com seus dados para acessar o monitoramento das máquinas.</p>

      <div className="authCampo">
        <label htmlFor="login-email">E-mail</label>
        <input
          id="login-email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="authCampo">
        <label htmlFor="login-senha">Senha</label>
        <input
          id="login-senha"
          type="password"
          placeholder="Digite sua senha"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {mensagemErro && <p className="authErro" role="alert">{mensagemErro}</p>}

      <button className="authBotaoPrimario" onClick={entrar} disabled={carregando}>
        {carregando ? 'Entrando...' : 'Entrar'}
      </button>

      <button className="authBotaoTexto" onClick={esqueciSenha} disabled={carregando}>
        Esqueci minha senha
      </button>

      <div className="authCadastro">
        <span>Não possui uma conta?</span>
        <button className="authBotaoCadastro" onClick={cadastrar} disabled={carregando}>Criar cadastro</button>
      </div>
    </div>
  );
}

export default TelaLogin;
