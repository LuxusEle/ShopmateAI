import React, { useEffect, useState } from 'react';
import InvoiceList from '../components/invoices/InvoiceList';
import InvoiceForm from '../components/invoices/InvoiceForm';
import { fetchInvoices } from '../services/api';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        const loadInvoices = async () => {
            const data = await fetchInvoices();
            setInvoices(data);
        };
        loadInvoices();
    }, []);

    const handleEdit = (invoice) => {
        setSelectedInvoice(invoice);
    };

    const handleFormClose = () => {
        setSelectedInvoice(null);
    };

    return (
        <div className="invoices-page">
            <h1>Invoices</h1>
            <InvoiceList invoices={invoices} onEdit={handleEdit} />
            <InvoiceForm invoice={selectedInvoice} onClose={handleFormClose} />
        </div>
    );
};

export default Invoices;