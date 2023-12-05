import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import css from './App.module.css';

export const App = () => {
  const [contacts, setContacts] = useState(() => {
    return (
      JSON.parse(localStorage.getItem('contacts')) ?? [
        { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
        { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
        { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      ]
    );
  });

  const [filter, setFilter] = useState('');

  //При кожній зміні масиву контактів - зберігаємо їх в localStorage
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  //Функція генерації id. Сама Функція nanoid() приймає необов'язковий аргумент, що задає довжину id
  const generetedId = () => {
    return nanoid(5);
  };

  // Функція оновлення полів фільтру
  const handleChangeFilter = event => {
    const { value } = event.currentTarget;
    setFilter(value);
  };

  //Функція фільтрації контактів
  const getFilteredContacts = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  //Функція видалення контакту зі списку контактів
  const deleteContact = deleteId => {
    setContacts(PrevState =>
      PrevState.filter(contact => contact.id !== deleteId)
    );
    setFilter('');
  };

  //Функція обробки сабміту форми - додаємо дані в state (дані отримуємо з компонента ContactForm)
  const formSubmitHandler = data => {
    console.log(data);
    //Заборона додавати контакти, імена яких вже присутні у телефонній книзі.
    if (contacts.some(contact => contact.name === data.name)) {
      alert(`${data.name} is already in contacts.`);
      return;
    }
    setContacts([
      ...contacts,
      { id: generetedId(), name: data.name, number: data.number },
    ]);
  };

  const filteredContacts = getFilteredContacts();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#010101',
        background: '#f5f3da',
      }}
    >
      <h1 className={css.title}>Phonebook</h1>
      <ContactForm onSubmit={formSubmitHandler} />
      <h2 className={css.subtitle}>Contacts</h2>
      <p className={css.total}>
        Total contacts:
        <span className={css.total_count}> {contacts.length}</span>
      </p>
      <Filter value={filter} onChange={handleChangeFilter} />
      <ContactList
        filteredContacts={filteredContacts}
        onDeleteContact={deleteContact}
      />
    </div>
  );
};
