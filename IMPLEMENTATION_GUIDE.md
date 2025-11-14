# HOH 108 - Complete Admin Panel Implementation Guide

## 🎯 Project Overview

This guide covers the implementation of a comprehensive admin panel with:
- Full CRUD operations for users, employees, customers, and projects
- Role-based access control (RBAC) with permissions
- User panel for customers to view projects and approve designs
- JWT-based authentication
- Professional UI with sidebar navigation

## ✅ What Has Been Built

### Backend Models (100% Complete)
1. **User Model** - Extended with roles and permissions
   - Location: `/backend/models/User.js`
   - Features: roles (user, admin, manager, designer, crm), permissions array, status tracking

2. **Employee Model** - Complete employee management
   - Location: `/backend/models/Employee.js`
   - Fields: employeeId, role, department, status, salary, portfolio, assignedProjects

3. **Customer Model** - Customer management with KYC
   - Location: `/backend/models/Customer.js`
   - Features: Auto-generated customerId, KYC documents, CRM/Designer assignment

4. **Project Model** - Comprehensive project tracking
   - Location: `/backend/models/Project.js`
   - Features: Milestones, timeline, budget tracking, documents, multiple statuses

5. **Design Model** - Design approval system
   - Location: `/backend/models/Design.js`
   - Features: BOQ (Bill of Quantities), approval workflow, version control, customer comments

### Frontend Components (Partial)
1. **Admin Login** - `/src/pages/AdminLogin.jsx`
2. **Admin Layout** - `/src/components/AdminLayout.jsx` with sidebar navigation
3. **Admin Dashboard** - `/src/pages/AdminDashboard.jsx` with statistics

### Documentation
1. **API Documentation** - Complete API reference (`/API_DOCUMENTATION.md`)
2. **Implementation Guide** - This document

## 🚀 Next Steps to Complete the System

### Phase 1: Backend API Development

#### 1. Create Admin Middleware
File: `/backend/middleware/adminAuth.js`
```javascript
// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
  }
  next();
};

// Check specific permission
exports.hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ success: false, message: 'Permission denied' });
    }
    next();
  };
};
```

#### 2. Create Employee Controller
File: `/backend/controllers/employeeController.js`
```javascript
const Employee = require('../models/Employee');

// GET all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const employees = await Employee.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Employee.countDocuments(query);

    res.json({
      success: true,
      data: employees,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST create employee
exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

#### 3. Create Employee Routes
File: `/backend/routes/employees.js`
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin, hasPermission } = require('../middleware/adminAuth');
const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

router.use(protect); // All routes require authentication
router.use(isAdmin); // All routes require admin role

router.route('/')
  .get(hasPermission('view_employees'), getAllEmployees)
  .post(hasPermission('create_employees'), createEmployee);

router.route('/:id')
  .put(hasPermission('edit_employees'), updateEmployee)
  .delete(hasPermission('delete_employees'), deleteEmployee);

module.exports = router;
```

#### 4. Update server.js
Add to `server.js`:
```javascript
const employeeRoutes = require('./routes/employees');
app.use('/api/admin/employees', employeeRoutes);
```

### Phase 2: Frontend Development

#### 1. Create Employee Management Page
File: `/src/pages/AdminEmployees.jsx`

Key features to implement:
- Table with employee list
- Search and filter functionality
- Add Employee modal/form
- Edit Employee modal/form
- Delete confirmation dialog
- Pagination
- Status badges
- Role-based UI rendering

Use this structure:
```jsx
import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import axios from 'axios';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch employees
  // Add employee
  // Edit employee
  // Delete employee
  // Search/Filter

  return (
    <AdminLayout>
      {/* Employee table */}
      {/* Add/Edit modal */}
    </AdminLayout>
  );
};
```

#### 2. Create API Service
File: `/src/services/adminApi.js`
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/admin';

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const employeeAPI = {
  getAll: (params) => axios.get(`${API_URL}/employees`, { ...getAuthHeader(), params }),
  create: (data) => axios.post(`${API_URL}/employees`, data, getAuthHeader()),
  update: (id, data) => axios.put(`${API_URL}/employees/${id}`, data, getAuthHeader()),
  delete: (id) => axios.delete(`${API_URL}/employees/${id}`, getAuthHeader())
};
```

### Phase 3: Replicate for Other Entities

Follow the same pattern for:
1. **Users Management** - User CRUD with role/permission assignment
2. **Customers Management** - Customer CRUD with KYC management
3. **Projects Management** - Project CRUD with milestone tracking
4. **Designs** - Design upload and approval workflow

Each entity needs:
- Controller (`/backend/controllers/[entity]Controller.js`)
- Routes (`/backend/routes/[entity].js`)
- Frontend Page (`/src/pages/Admin[Entity].jsx`)
- API Service (`/src/services/adminApi.js` - add methods)

### Phase 4: User Panel

Create user-facing pages for customers:

1. **User Dashboard** - `/src/pages/UserDashboard.jsx`
   - Show project overview
   - KYC status
   - Assigned designer info

2. **Project Details** - `/src/pages/UserProjectDetails.jsx`
   - Project information
   - Timeline and milestones
   - Assigned team (CRM, Designer)
   - Designer portfolio

3. **Design Viewer** - `/src/pages/UserDesignViewer.jsx`
   - View design files
   - View BOQ
   - Approve/Reject buttons
   - Add comments

### Phase 5: Seed Admin User

Create file: `/backend/scripts/seedAdmin.js`
```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminExists = await User.findOne({ email: 'admin@interiormanagers.com' });
    if (adminExists) {
      console.log('Admin already exists');
      return;
    }

    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@interiormanagers.com',
      phone: '9999999999',
      password: 'admin123456',
      role: 'admin',
      permissions: [
        'view_users', 'create_users', 'edit_users', 'delete_users',
        'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
        'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
        'view_projects', 'create_projects', 'edit_projects', 'delete_projects',
        'view_designs', 'create_designs', 'edit_designs', 'delete_designs',
        'view_dashboard', 'manage_roles', 'manage_permissions'
      ],
      status: 'active'
    });

    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAdmin();
```

Run with: `node backend/scripts/seedAdmin.js`

## 📝 Implementation Checklist

### Backend
- [x] Create all database models
- [x] Update User model with permissions
- [ ] Create admin middleware
- [ ] Create Employee CRUD controller
- [ ] Create Employee routes
- [ ] Create Customer CRUD controller
- [ ] Create Customer routes
- [ ] Create Project CRUD controller
- [ ] Create Project routes
- [ ] Create Design CRUD controller
- [ ] Create Design routes
- [ ] Create User Panel API endpoints
- [ ] Update server.js with all routes
- [ ] Create seed script for admin

### Frontend
- [x] Create AdminLogin page
- [x] Create AdminLayout
- [x] Create AdminDashboard
- [ ] Create AdminEmployees page
- [ ] Create AdminUsers page
- [ ] Create AdminCustomers page
- [ ] Create AdminProjects page
- [ ] Create UserDashboard page
- [ ] Create UserProjectDetails page
- [ ] Create UserDesignViewer page
- [ ] Update App.jsx with all routes
- [ ] Create adminApi service
- [ ] Implement role-based UI rendering

## 🎨 UI Components Needed

1. **DataTable** - Reusable table with pagination, search, sort
2. **Modal** - For add/edit forms
3. **ConfirmDialog** - For delete confirmations
4. **Form Components** - Input, Select, TextArea, DatePicker, FileUpload
5. **StatusBadge** - Color-coded status indicators
6. **PermissionChecker** - Component to conditionally render based on permissions

## 🔐 Security Considerations

1. Always validate user permissions on backend
2. Never trust client-side role checks alone
3. Sanitize all user inputs
4. Use HTTPS in production
5. Implement rate limiting
6. Log all admin actions
7. Regular security audits

## 🚀 Quick Start

1. Run seed script to create admin:
   ```bash
   node backend/scripts/seedAdmin.js
   ```

2. Login as admin:
   - Email: admin@interiormanagers.com
   - Password: admin123456

3. Start creating employees, customers, and projects

## 📚 Additional Resources

- MongoDB Documentation: https://docs.mongodb.com
- Express.js Guide: https://expressjs.com
- React Documentation: https://react.dev
- JWT Guide: https://jwt.io

## 🆘 Troubleshooting

**Q: Can't log in as admin?**
A: Run the seed script first to create the admin user.

**Q: Getting 403 Forbidden errors?**
A: Check that the user has the required permissions in the database.

**Q: Design files not uploading?**
A: Implement file upload with multer and cloud storage (AWS S3/Cloudinary).

## 📞 Support

For issues or questions, check:
1. API Documentation (`/API_DOCUMENTATION.md`)
2. This Implementation Guide
3. Console logs for error details

---

**Note**: This is a comprehensive system. Implement one module at a time (e.g., start with Employees), test thoroughly, then move to the next module.
