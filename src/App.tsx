import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import LoadingSpinner from './components/ui/loading-spinner';

// Page components
const HomePage = (): React.ReactElement => <div>Home Page</div>;
const ChatPage = (): React.ReactElement => <div>Chat Page</div>;
const DocumentsPage = (): React.ReactElement => <div>Documents Page</div>;
const AdminPage = (): React.ReactElement => <div>Admin Page</div>;
const NotFoundPage = (): React.ReactElement => <div>Not Found Page</div>;

const App = (): React.ReactElement => (
  <div className="app-container">
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </div>
);

export default App;
