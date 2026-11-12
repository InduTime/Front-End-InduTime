import { useState } from 'react';

import TelaLogin from './component/telaLogin';
import TelaCadastro from './component/telaCadastro';
import EsqueciSenha from './component/esqueciSenha';

import ContactForm from './component/contactForm';
import ContactList from './component/contactList';

import './App.css';
import imagemCnc from './assets/cnc.jpeg';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import DashBoard from './tela/DashBoard';

function App() {
  // Tela atual
  // Pode ser: 'login', 'cadastro', 'senha', 'crud_lista' ou 'crud_form'
  const [tela, setTela] = useState('login');

  // Lista de contatos
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Suporte InduTime',
      phone: '(11) 98765-4321',
    },
  ]);

  // Contato selecionado para edição
  // null = criando um novo contato
  const [contactToEdit, setContactToEdit] = useState(null);

  // =========================
  // AÇÕES DO CRUD
  // =========================

  // Salvar ou atualizar contato
  function handleSaveContact(contactData) {
    if (contactToEdit) {
      setContacts(
        contacts.map((contact) =>
          contact.id === contactData.id ? contactData : contact
        )
      );
    } else {
      setContacts([
        ...contacts,
        {
          ...contactData,
          id: Date.now(),
        },
      ]);
    }

    setContactToEdit(null);
    setTela('crud_lista');
  }

  // Iniciar edição
  function handleStartEdit(contact) {
    setContactToEdit(contact);
    setTela('crud_form');
  }

  // Remover contato
  function handleDeleteContact(id) {
    if (window.confirm('Deseja realmente remover este contato?')) {
      setContacts(contacts.filter((contact) => contact.id !== id));
    }
  }

  // Criar novo contato
  function handleNewContact() {
    setContactToEdit(null);
    setTela('crud_form');
  }

  return (
    <div className="app">
      {/* =========================
          LADO ESQUERDO
          ========================= */}
      <div className="left-side">
        <div className="branding">
          ⚙ InduTime
        </div>

        <div className="image-container">
          <img
            src={imagemCnc}
            alt="Máquina CNC"
            className="cnc-image"
          />
        </div>

        <div className="branding-text">
          <h2>
            Precisão e controle de tempo para sua manufatura.
          </h2>

          <p>
            Monitore o tempo de operação de seus tornos CNC em
            tempo real através da nossa rede integrada de sensores
            IoT.
          </p>
        </div>

        <div className="footer-branding">
          INDUTIME • TECNOLOGIA INDUSTRIAL
        </div>
      </div>

      {/* =========================
          LADO DIREITO
          ========================= */}
      <div className="right-side">
        <div className="content">
          
          {/* =========================
              TELA DE LOGIN
              ========================= */}
          {tela === 'login' && (
            <TelaLogin
              onLogin={() => setTela('crud_lista')}
              onCadastro={() => setTela('cadastro')}
              onEsqueciSenha={() => setTela('senha')}
            />
          )}

          {/* =========================
              TELA DE CADASTRO
              ========================= */}
          {tela === 'cadastro' && (
            <TelaCadastro
              Voltar={() => setTela('login')}
            />
          )}

          {/* =========================
              TELA ESQUECI SENHA
              ========================= */}
          {tela === 'senha' && (
            <EsqueciSenha
              Voltar={() => setTela('login')}
            />
          )}

          {/* =========================
              LISTA DE CONTATOS
              ========================= */}
          {tela === 'crud_lista' && (
            <ContactList
              contacts={contacts}
              onEdit={handleStartEdit}
              onDelete={handleDeleteContact}
              onNew={handleNewContact}
            />
          )}

          {/* =========================
              FORMULÁRIO DE CONTATO
              ========================= */}
          {tela === 'crud_form' && (
            <ContactForm
              contact={contactToEdit}
              onSave={handleSaveContact}
              onCancel={() => {
                setContactToEdit(null);
                setTela('crud_lista');
              }}
            />
          )}

        </div>

        <div className="copyright">
          © 2026 InduTime. Todos os direitos reservados.
        </div>
      </div>
    </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <Link
                to="/DashBoard"
                className="App-link"
                >
                DashBoard
              </Link>
            </header>
          </div>
        }/>
        <Route path="/DashBoard"element={<DashBoard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
