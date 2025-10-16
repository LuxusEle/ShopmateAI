import React, { useEffect, useState } from 'react';
import ContactList from '../components/contacts/ContactList';
import ContactForm from '../components/contacts/ContactForm';
import { fetchContacts } from '../services/api';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
        const loadContacts = async () => {
            const data = await fetchContacts();
            setContacts(data);
        };
        loadContacts();
    }, []);

    const handleContactSelect = (contact) => {
        setSelectedContact(contact);
    };

    const handleContactSave = (contact) => {
        setContacts((prevContacts) => {
            if (selectedContact) {
                return prevContacts.map((c) => (c.id === contact.id ? contact : c));
            }
            return [...prevContacts, contact];
        });
        setSelectedContact(null);
    };

    return (
        <div className="contacts-page">
            <h1>Contact Management</h1>
            <ContactForm contact={selectedContact} onSave={handleContactSave} />
            <ContactList contacts={contacts} onSelect={handleContactSelect} />
        </div>
    );
};

export default Contacts;