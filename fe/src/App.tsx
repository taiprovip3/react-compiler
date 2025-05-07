import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './contexts/ProtectedRoute';
import VerifyEmailPage from './pages/VerifyEmail/VerifyEmailPage';
import { lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import MainLayout from './layouts/MainLayout';
import { LoadingProvider } from './contexts/LoadingContext';
import GlobalLoadingOverlay from './components/GlobalLoadingOverlay';
import { GlobalMessageProvider } from './contexts/GlobalMessageContext';

const HomePage = lazy(() => import('./pages/Home/HomePage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const WallPage = lazy(() => import('./pages/Wall/WallPage'));

const App: React.FC = () => {
  return (
    <Router>
      <LoadingProvider>
        <GlobalLoadingOverlay />
        <GlobalMessageProvider >
          <AuthProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Suspense fallback={<LoadingScreen />}><HomePage /></Suspense>} />
                <Route path="/profile" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><ProfilePage /></Suspense></ProtectedRoute>} />
                <Route path="/verify-email" element={<Suspense fallback={<LoadingScreen />}><VerifyEmailPage /></Suspense>} />
                <Route path="/wall" element={<WallPage />} />
                <Route path="/test" element={<LoadingScreen />} />
              </Route>
            </Routes>
          </AuthProvider>
        </GlobalMessageProvider>
      </LoadingProvider>
    </Router>
  );
};

export default App;
