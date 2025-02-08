import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Homepage from './pages/Home/Homepage';
import Profilepage from './pages/Profile/Profilepage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/profile" element={<Profilepage />} />
        </Routes>
      </AuthProvider>
    </Router>
    
  );
};

export default App;
