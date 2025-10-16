import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Sidebar />
        <main>
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <Route path="/contacts" component={Contacts} />
            <Route path="/tasks" component={Tasks} />
            <Route path="/invoices" component={Invoices} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;