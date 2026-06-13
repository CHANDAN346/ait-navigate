import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Map from './pages/Map';
import RoomFinder from './pages/RoomFinder';
import FacultyFinder from './pages/FacultyFinder';
import Events from './pages/Events';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-background text-slate-900">
      {!isLoginPage && <Navbar />}
      <main className={`mx-auto px-4 py-6 sm:px-6 ${!isLoginPage ? 'max-w-6xl lg:px-8' : 'max-w-none'} ${!isLoginPage ? 'pb-20 sm:pb-8' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <Map />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room-finder"
            element={
              <ProtectedRoute>
                <RoomFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty-finder"
            element={
              <ProtectedRoute>
                <FacultyFinder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isLoginPage && <BottomNav />}
    </div>
  );
}

export default App;
