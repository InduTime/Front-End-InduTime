import React, { useState, useEffect } from 'react';

export default function ContactForm({
  contact,
  onSave,
  onCancel,
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Preenche os campos quando estiver editando
  useEffect(() => {
    if (contact) {
      setName(contact.name || '');
      setPhone(contact.phone || '');
    } else {
      setName('');
      setPhone('');
    }
  }, [contact]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert('Preencha o nome e o telefone!');
      return;
    }

    onSave({
      id: contact ? contact.id : undefined,
      name: name.trim(),
      phone: phone.trim(),
    });
  }

  return (
    <div className="contact-form">
      <h2>
        {contact ? 'Editar Contato' : 'Novo Contato'}
      </h2>

      <p>
        {contact
          ? 'Altere os dados do contato abaixo.'
          : 'Preencha os dados para cadastrar um novo contato.'}
      </p>

      <form onSubmit={handleSubmit}>
        {/* Nome */}
        <div className="form-group">
          <label htmlFor="name">
            Nome
          </label>

          <input
            id="name"
            type="text"
            placeholder="Digite o nome"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        {/* Telefone */}
        <div className="form-group">
          <label htmlFor="phone">
            Telefone
          </label>

          <input
            id="phone"
            type="tel"
            placeholder="(11) 98765-4321"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        {/* Botões */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
          >
            {contact ? 'Salvar alterações' : 'Cadastrar contato'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="btn-cancel"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
