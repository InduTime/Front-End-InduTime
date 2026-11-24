import { useState } from 'react';
import { API_URL } from '../services/api';

function extrairMensagemErro(payload) {
  if (typeof payload === 'string') return payload.trim();
  if (Array.isArray(payload)) {
    return payload.map(extrairMensagemErro).filter(Boolean).join('; ');
  }
  if (!payload || typeof payload !== 'object') return '';

  for (const campo of ['message', 'mensagem', 'detail', 'description', 'defaultMessage']) {
    if (typeof payload[campo] === 'string' && payload[campo].trim()) {
      return payload[campo].trim();
    }
  }

  for (const campo of ['errors', 'erros', 'error']) {
    const mensagem = extrairMensagemErro(payload[campo]);
    if (mensagem) return mensagem;
  }

  return '';
}

async function obterMensagemErro(res, fallback) {
  const corpo = await res.text().catch(() => '');
  if (!corpo.trim()) return fallback;

  try {
    return extrairMensagemErro(JSON.parse(corpo)) || corpo.trim();
  } catch {
    return corpo.trim();
  }
}

function EsqueciSenha({ voltar }) {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [carregando, setCarregando] = useState(false);

  async function alterarSenha() {
    setMensagem({ texto: '', tipo: '' });

    if (!email || !novaSenha || !confirmarSenha) {
      setMensagem({ texto: 'Preencha todos os campos.', tipo: 'erro' });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem({ texto: 'As senhas não conferem.', tipo: 'erro' });
      return;
    }

    if (novaSenha.length < 8) {
      setMensagem({ texto: 'A senha deve ter no mínimo 8 caracteres.', tipo: 'erro' });
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/usuarios/email/${encodeURIComponent(email)}/senha`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novaSenha })
      });

      if (!res.ok) {
        const fallback = res.status === 404
          ? 'Usuário não encontrado.'
          : res.status === 400
            ? 'Os dados informados são inválidos.'
            : 'Erro ao alterar senha.';
        const texto = await obterMensagemErro(res, fallback);
        setMensagem({ texto, tipo: 'erro' });
        return;
      }

      alert('Senha alterada com sucesso!');
      voltar();
    } catch {
      setMensagem({
        texto: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
        tipo: 'erro'
      });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div>
      <h1>Alterar senha</h1>

      <input
        type="email"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Nova senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Confirme sua nova senha"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
      />
      <br />

      {mensagem.texto && (
        <p style={{ color: mensagem.tipo === 'erro' ? 'red' : 'green' }}>
          {mensagem.texto}
        </p>
      )}
      <br />

      <button onClick={alterarSenha} disabled={carregando}>
        {carregando ? 'Alterando...' : 'Alterar senha'}
      </button>
      <br />

      <button onClick={voltar} disabled={carregando}>
        Voltar para Login
      </button>
    </div>
  );
}

export default EsqueciSenha;
