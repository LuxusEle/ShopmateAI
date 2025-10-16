import React from 'react';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { TaskBoard } from '../components/tasks/TaskBoard';
import { ContactList } from '../components/contacts/ContactList';
import { InvoiceList } from '../components/invoices/InvoiceList';

const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">
            <Header />
            <div className="dashboard-content">
                <Sidebar />
                <main>
                    <h1>Dashboard</h1>
                    <section>
                        <h2>Tasks Overview</h2>
                        <TaskBoard />
                    </section>
                    <section>
                        <h2>Contacts Overview</h2>
                        <ContactList />
                    </section>
                    <section>
                        <h2>Invoices Overview</h2>
                        <InvoiceList />
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;