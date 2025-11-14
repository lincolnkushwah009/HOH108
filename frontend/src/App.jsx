import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { ServiceTypeProvider } from './contexts/ServiceTypeContext'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import HowItWorks from './pages/HowItWorks'
import WhyUs from './pages/WhyUs'
import Portfolio from './pages/Portfolio'
import Blog from './pages/Blog'
import BlogDetail from './pages/BlogDetail'
import MyProjects from './pages/MyProjects'
import ProfilePlaceholder from './pages/ProfilePlaceholder'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import InteriorAdminDashboard from './pages/InteriorAdminDashboard'
import ConstructionAdminDashboard from './pages/ConstructionAdminDashboard'
import RenovationAdminDashboard from './pages/RenovationAdminDashboard'
import OnDemandAdminDashboard from './pages/OnDemandAdminDashboard'
import ODSBookingsManagement from './pages/ODSBookingsManagement'
import ODSProvidersManagement from './pages/ODSProvidersManagement'
import ODSServicesManagement from './pages/ODSServicesManagement'
import AdminEmployees from './pages/AdminEmployees'
import AdminLeads from './pages/AdminLeads'
import AdminUsers from './pages/AdminUsers'
import AdminSettings from './pages/AdminSettings'
import AdminCustomers from './pages/AdminCustomers'
import AdminProjects from './pages/AdminProjects'
import AdminBlogs from './pages/AdminBlogs'
import AdminKYC from './pages/AdminKYC'
import AdminCollections from './pages/AdminCollections'
import CustomerKYC from './pages/CustomerKYC'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Renovations from './pages/Renovations'
import InteriorDesign from './pages/InteriorDesign'
import Construction from './pages/Construction'
import OnDemandServices from './pages/OnDemandServices'
import ServiceDetail from './pages/ServiceDetail'
import TrackBooking from './pages/TrackBooking'
import { auth } from './services/api'

// Component to handle role-based dashboard routing
const DashboardRedirect = () => {
  const { user } = auth.getAuthData()

  if (!user || !user.role) {
    return <Navigate to="/admin/login" replace />
  }

  switch (user.role) {
    case 'super_admin':
      return <Navigate to="/admin/super-dashboard" replace />
    case 'interior_admin':
      return <Navigate to="/admin/interior-dashboard" replace />
    case 'construction_admin':
      return <Navigate to="/admin/construction-dashboard" replace />
    case 'renovation_admin':
      return <Navigate to="/admin/renovation-dashboard" replace />
    case 'on_demand_admin':
      return <Navigate to="/admin/on-demand-dashboard" replace />
    default:
      return <Navigate to="/admin/dashboard" replace />
  }
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <ServiceTypeProvider>
            <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/renovations" element={<Renovations />} />
          <Route path="/interior-design" element={<InteriorDesign />} />
          <Route path="/construction" element={<Construction />} />
          <Route path="/on-demand-services" element={<OnDemandServices />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/track-booking" element={<TrackBooking />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Role-based Dashboard Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/super-dashboard"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/interior-dashboard"
          element={
            <ProtectedRoute>
              <InteriorAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/construction-dashboard"
          element={
            <ProtectedRoute>
              <ConstructionAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/renovation-dashboard"
          element={
            <ProtectedRoute>
              <RenovationAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/on-demand-dashboard"
          element={
            <ProtectedRoute>
              <OnDemandAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/on-demand/bookings"
          element={
            <ProtectedRoute>
              <ODSBookingsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/on-demand/providers"
          element={
            <ProtectedRoute>
              <ODSProvidersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/on-demand/services"
          element={
            <ProtectedRoute>
              <ODSServicesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute>
              <AdminEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute>
              <AdminLeads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute>
              <AdminCustomers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <ProtectedRoute>
              <AdminBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/kyc"
          element={
            <ProtectedRoute>
              <AdminKYC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/collections"
          element={
            <ProtectedRoute>
              <AdminCollections />
            </ProtectedRoute>
          }
        />

        {/* Protected Profile Routes */}
        <Route
          path="/profile/kyc"
          element={
            <ProtectedRoute>
              <CustomerKYC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/projects"
          element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/referrals"
          element={
            <ProtectedRoute>
              <ProfilePlaceholder
                title="My Referrals"
                description="Refer friends and family to earn exciting rewards!"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/design-library"
          element={
            <ProtectedRoute>
              <ProfilePlaceholder
                title="Design Library"
                description="Browse and save your favorite design inspirations."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/wishlist"
          element={
            <ProtectedRoute>
              <ProfilePlaceholder
                title="My Wishlist"
                description="Your saved items and favorite products."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/interior-wishlist"
          element={
            <ProtectedRoute>
              <ProfilePlaceholder
                title="Interior Wishlist"
                breadcrumb="Interior Wishlist (0)"
                description="Save and organize your interior design wishlist."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/price-estimate"
          element={
            <ProtectedRoute>
              <ProfilePlaceholder
                title="Price Estimate"
                description="View all your project price estimates."
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/issues"
          element={
            <ProtectedRoute>
              <ProfilePlaceholder
                title="My Issues"
                description="Track and manage your support tickets."
              />
            </ProtectedRoute>
          }
        />
            </Routes>
          </ServiceTypeProvider>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  )
}

export default App
