import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import TemplateList from './components/templates/TemplateList';
import TemplateDetails from './components/templates/TemplateDetails';
import TemplateForm from './components/templates/TemplateForm';
import CollectionList from './components/collections/CollectionList';
import CategoryManagement from './components/categories/CategoryManagement';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/library" element={<TemplateList />} />
          <Route path="/templates/new" element={<TemplateForm mode="create" />} />
          <Route path="/templates/:id" element={<TemplateDetails />} />
          <Route path="/collections" element={<CollectionList />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;