// import { useState } from 'react'
// import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Homepage from './components/Homepage';
import ProfileComponent from './components/ProfileComponent';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<ProfileComponent />} />
        </Routes>
      </AuthProvider>
    </Router>
    
  );
};

export default App;
