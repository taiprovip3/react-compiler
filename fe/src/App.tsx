import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Homepage from './pages/Home/Homepage';
import Profilepage from './pages/Profile/Profilepage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<ProtectedRoute><Profilepage /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
    
  );
};

export default App;
