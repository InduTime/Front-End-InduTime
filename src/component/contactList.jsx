import React from 'react';

export default function ContactList({
  contacts,
  onEdit,
  onDelete,
  onNew,
}) {
  return (
    <div className="contact-list">
      {/* Cabeçalho */}
      <div className="contact-header">
        <div>
          <h2>Agenda de Contatos</h2>
          <p>Gerencie seus contatos</p>
        </div>

        <button
          type="button"
          onClick={onNew}
          className="btn-new"
        >
          + Novo contato
        </button>
      </div>

      {/* Lista vazia */}
      {contacts.length === 0 ? (
        <div className="empty-contacts">
          <p>Nenhum contato cadastrado.</p>

          <button
            type="button"
            onClick={onNew}
            className="btn-new"
          >
            Cadastrar primeiro contato
          </button>
        </div>
      ) : (
        <ul className="contacts">
          {contacts.map((item) => (
            <li key={item.id} className="contact-item">
              {/* Informações */}
              <div className="contact-info">
                <strong>{item.name}</strong>
                <br />
                <small>{item.phone}</small>
              </div>

              {/* Botões */}
              <div className="contact-actions">
                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="btn-edit"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="btn-delete"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
