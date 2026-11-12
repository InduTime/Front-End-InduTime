import { useState } from 'react';

function EsqueciSenha({ voltar }) {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' }); // tipo: 'erro' ou 'sucesso'
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
      const res = await fetch(`http://10.110.12.57:8080/usuarios/email/${encodeURIComponent(email)}/senha`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        // A documentação cortou antes de mostrar o formato, mas normalmente o PATCH recebe um JSON ou um texto simples.
        // Se a API falhar aqui, verifique no Swagger se a senha vai no body como JSON, como string plana, ou via query params (?senha=...).
        body: JSON.stringify({ senha: novaSenha }) 
      });

      if (!res.ok) {
        const erro = await res.json().catch(() => ({ message: 'Erro ao alterar senha.' }));
        setMensagem({ texto: erro.message || 'Erro ao alterar senha.', tipo: 'erro' });
        setCarregando(false);
        return;
      }

      alert('Senha alterada com sucesso!');
      voltar(); // Volta para o login
    } catch (error) {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
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