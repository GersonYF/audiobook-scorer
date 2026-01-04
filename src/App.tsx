import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import BookScoringWizard from './components/BookScoringWizard';
import BackgroundScoring from './components/BackgroundScoring';
import JobDetail from './components/JobDetail';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/jobs" replace />} />
          <Route path="jobs" element={<BackgroundScoring />} />
          <Route path="wizard" element={<BookScoringWizard />} />
          <Route path="jobs/:id" element={<JobDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
