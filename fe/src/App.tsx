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

// --- test ---
import EditProductModal from './pages/Wall/EditProductModal';
const product = {
  name: "CPU i9 14900k",
  price: 1000,
  thumbnailUrl:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkryvGWAxy0DgQg3IGlz8x6qFa9nimLbXurA&s",
  subImages: [
    {
      des: "des 1",
      url: "https://product.hstatic.net/1000333506/product/intel-core-i9-14900k-desktop-cpu_0813da396d5a46439d434525a1ed2786.png",
    },
    {
      des: "des 2",
      url: "https://bcavn.com/Image/Picture/New/Core-i9-14900K-bi-trang-cong-nghe-danh-gia-loi-nang.jpg",
    },
  ],
};
// --- test ---

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
                <Route path="/wall" element={<ProtectedRoute><Suspense fallback={<LoadingScreen />}><WallPage /></Suspense></ProtectedRoute>} />
                <Route path="/test" element={<EditProductModal initialData={product} />} />
              </Route>
            </Routes>
          </AuthProvider>
        </GlobalMessageProvider>
      </LoadingProvider>
    </Router>
  );
};

export default App;
