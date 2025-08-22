import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/programs';
import GetInvolved from './pages/GetInvolved';
import Contact from './pages/Contact';
import Impact from './pages/Impact';
import Stories from './pages/Stories';
import Donate from './pages/Donate';
import StoryDetail from './pages/StoryDetail';
import Login from './pages/Login';


// CMS Components
import AdminLogin from './pages/cms/AdminLogin';
import AdminDashboard from './pages/cms/AdminDashboard';
import ManagerDashboard from './pages/cms/ManagerDashboard';
import EditorDashboard from './pages/cms/EditorDashboard';
import EditorCreateStory from './pages/cms/EditorCreateStory';
import EditorMyStories from './pages/cms/EditorMyStories';
import EditorContentLibrary from './pages/cms/EditorContentLibrary';
import EditorDrafts from './pages/cms/EditorDrafts';
import EditorStoryEditor from './pages/cms/EditorStoryEditor';
import StoryEditor from './pages/cms/StoryEditor';
import DonationsManagement from './pages/cms/DonationsManagement';
import ContentManagement from './pages/cms/ContentManagement';
import AdminLayout from './components/cms/AdminLayout';
import EditorLayout from './components/cms/EditorLayout';
import Analytics from './pages/cms/Analytics';
import Users from './pages/cms/Users';
import Settings from './pages/cms/Settings';
import StoriesCMS from './pages/cms/Stories';
import Reports from './pages/cms/Reports';
import SystemHealth from './pages/cms/SystemHealth';
import Backup from './pages/cms/Backup';
import AuditLogs from './pages/cms/AuditLogs';
import Alerts from './pages/cms/Alerts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* CMS Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/stories/new" element={<AdminLayout><StoryEditor /></AdminLayout>} />
            <Route path="/admin/stories/edit/:id" element={<AdminLayout><StoryEditor /></AdminLayout>} />
            <Route path="/admin/stories" element={<AdminLayout><StoriesCMS /></AdminLayout>} />
            <Route path="/admin/donations" element={<AdminLayout><DonationsManagement /></AdminLayout>} />
            <Route path="/admin/content" element={<AdminLayout><ContentManagement /></AdminLayout>} />
            <Route path="/admin/analytics" element={<AdminLayout><Analytics /></AdminLayout>} />
            <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
            <Route path="/admin/reports" element={<AdminLayout><Reports /></AdminLayout>} />
            <Route path="/admin/system-health" element={<AdminLayout><SystemHealth /></AdminLayout>} />
            <Route path="/admin/backup" element={<AdminLayout><Backup /></AdminLayout>} />
            <Route path="/admin/audit-logs" element={<AdminLayout><AuditLogs /></AdminLayout>} />
            <Route path="/admin/alerts" element={<AdminLayout><Alerts /></AdminLayout>} />
            
            {/* Role-Based Dashboard Routes */}
            <Route path="/manager/dashboard" element={<AdminLayout><ManagerDashboard /></AdminLayout>} />
            <Route path="/editor/dashboard" element={<EditorLayout><EditorDashboard /></EditorLayout>} />
            
            {/* Editor-Specific Routes */}
            <Route path="/editor/stories/new" element={<EditorLayout><EditorCreateStory /></EditorLayout>} />
            <Route path="/editor/stories/edit/:id" element={<EditorLayout><EditorStoryEditor /></EditorLayout>} />
            <Route path="/editor/stories" element={<EditorLayout><EditorMyStories /></EditorLayout>} />
            <Route path="/editor/library" element={<EditorLayout><EditorContentLibrary /></EditorLayout>} />
            <Route path="/editor/drafts" element={<EditorLayout><EditorDrafts /></EditorLayout>} />
    
            {/* Public Website Routes */}
            <Route path="/*" element={
              <>
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/impact" element={<Impact />} />
                    <Route path="/stories" element={<Stories />} />
                    <Route path="/stories/:id" element={<StoryDetail />} />
                    <Route path="/get-involved" element={<GetInvolved />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />

                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
