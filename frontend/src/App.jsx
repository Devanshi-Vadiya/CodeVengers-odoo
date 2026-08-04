import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          gutter={10}
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              borderRadius: '12px',
              padding: '10px 14px',
              background: '#FFFFFF',
              color: '#0F172A',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(15,23,42,0.10)',
              animation: 'toastSlideIn 200ms cubic-bezier(0.16,1,0.3,1) both',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#fff' },
              style: { borderLeft: '3px solid #22C55E' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#fff' },
              style: { borderLeft: '3px solid #EF4444' },
            },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
