import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useThemeStore from './store/themeStore';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';
import RegistrationConfirmPage from './pages/auth/RegistrationConfirmPage';
import CompanyForm from './pages/companies/CompanyForm';
import CompanyListPage from './pages/companies/CompanyListPage';
import JobListPage from './pages/jobs/JobListPage';
import JobForm from './pages/jobs/JobForm';
import JobApplicationForm from './pages/applications/JobApplicationForm';
import JobApplicationsByJobPage from './pages/applications/JobApplicationsByJobPage';
import MyApplicationsPage from './pages/applications/MyApplicationsPage';
import TestPage from './pages/TestPage';

const queryClient = new QueryClient();

function App() {
  const { theme } = useThemeStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/registrationConfirm" element={<RegistrationConfirmPage />} />
              <Route path="/companies" element={<CompanyListPage />} />
              <Route path="/companies/register" element={<CompanyForm />} />
              <Route path="/companies/edit/:companyId" element={<CompanyForm isEditMode={true} />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/create" element={<JobForm />} />
              <Route path="/jobs/edit/:jobId" element={<JobForm isEditMode={true} />} />
              <Route path="/apply/:id" element={<JobApplicationForm />} />
              <Route path="/applications/job/:jobId" element={<JobApplicationsByJobPage />} />
              <Route path="/my-applications" element={<MyApplicationsPage />} />
              <Route path="/test" element={<TestPage />} />
              {/* Add other routes here as needed */}
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
