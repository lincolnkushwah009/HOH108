# HOH 108 - Complete Admin Panel API Documentation

## Overview
This document outlines the complete admin panel system with role-based access control, user management, employee management, customer management, and project tracking.

## Database Models

### 1. User Model
- **Fields**: fullName, email, phone, password, role, permissions, status, isActive, lastLogin
- **Roles**: user, admin, manager, designer, crm
- **Permissions**: view_users, create_users, edit_users, delete_users, view_employees, create_employees, etc.

### 2. Employee Model
- **Fields**: employeeId, fullName, email, phone, role, department, status, joiningDate, salary, address, portfolio, assignedProjects
- **Roles**: designer, crm, manager, sales, support
- **Departments**: design, sales, support, management
- **Status**: active, inactive, on-leave

### 3. Customer Model
- **Fields**: customerId, user (ref), fullName, email, phone, address, kycStatus, kycDocuments, assignedCRM, assignedDesigner, projects, status
- **KYC Status**: pending, verified, rejected
- **Status**: active, inactive, blacklisted

### 4. Project Model
- **Fields**: projectId, title, description, customer, assignedDesigner, assignedCRM, projectType, roomTypes, carpetArea, budget, location, timeline, status, designs, milestones, documents
- **Project Types**: residential, commercial, office, hospitality
- **Status**: inquiry, design, approval_pending, approved, in_progress, completed, on_hold, cancelled

### 5. Design Model
- **Fields**: designId, project, title, description, version, designer, roomType, designFiles, boq, approvalStatus, approvedBy, approvedAt, rejectionReason, customerComments
- **Approval Status**: pending, approved, rejected, revision_requested
- **Status**: draft, submitted, under_review, approved, rejected

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/signup - Register new user
POST /api/auth/login - User login
GET /api/auth/me - Get current user profile
PUT /api/auth/profile - Update user profile
```

### Admin - User Management
```
GET /api/admin/users - Get all users (with pagination, search, filter)
GET /api/admin/users/:id - Get single user
POST /api/admin/users - Create new user
PUT /api/admin/users/:id - Update user
DELETE /api/admin/users/:id - Delete user
PUT /api/admin/users/:id/permissions - Update user permissions
PUT /api/admin/users/:id/status - Update user status
```

### Admin - Employee Management
```
GET /api/admin/employees - Get all employees
GET /api/admin/employees/:id - Get single employee
POST /api/admin/employees - Create new employee
PUT /api/admin/employees/:id - Update employee
DELETE /api/admin/employees/:id - Delete employee
GET /api/admin/employees/role/:role - Get employees by role
GET /api/admin/employees/status/:status - Get employees by status
```

### Admin - Customer Management
```
GET /api/admin/customers - Get all customers
GET /api/admin/customers/:id - Get single customer
POST /api/admin/customers - Create new customer
PUT /api/admin/customers/:id - Update customer
DELETE /api/admin/customers/:id - Delete customer
PUT /api/admin/customers/:id/kyc - Update KYC status
PUT /api/admin/customers/:id/assign - Assign CRM/Designer
```

### Admin - Project Management
```
GET /api/admin/projects - Get all projects
GET /api/admin/projects/:id - Get single project
POST /api/admin/projects - Create new project
PUT /api/admin/projects/:id - Update project
DELETE /api/admin/projects/:id - Delete project
PUT /api/admin/projects/:id/status - Update project status
PUT /api/admin/projects/:id/milestone - Update milestone
```

### User Panel - Project Viewing
```
GET /api/user/projects - Get my projects
GET /api/user/projects/:id - Get project details
GET /api/user/projects/:id/designs - Get project designs
GET /api/user/designs/:id - Get design with BOQ
PUT /api/user/designs/:id/approve - Approve design
PUT /api/user/designs/:id/reject - Reject design with reason
POST /api/user/designs/:id/comment - Add comment to design
```

## Role-Based Permissions

### Admin
- Full access to all endpoints
- Can create, edit, delete users, employees, customers, projects
- Can assign roles and permissions
- Can view all data and analytics

### Manager
- Can view all data
- Can edit employees, customers, projects
- Can assign projects to designers/CRM
- Cannot delete critical data
- Cannot manage admin users

### Designer
- Can view assigned projects
- Can create and edit designs
- Can upload design files and BOQ
- Cannot access customer KYC details
- Cannot edit other designers' work

### CRM
- Can view and edit customers
- Can create and manage projects
- Can assign designers to projects
- Can view project status and communicate with customers

### User (Customer)
- Can view own projects
- Can view assigned designer details
- Can approve/reject designs
- Can view and download design files and BOQ
- Can add comments to designs

## Middleware

### protect
- Verifies JWT token
- Attaches user to request
- Used for all authenticated routes

### authorize(...roles)
- Checks if user has required role
- Example: authorize('admin', 'manager')
- Returns 403 if unauthorized

### checkPermission(permission)
- Checks if user has specific permission
- Example: checkPermission('create_users')
- Returns 403 if permission not granted

## Frontend Pages

### Admin Panel
1. **Dashboard** - Statistics and overview
2. **Users Management** - Full CRUD for users with role/permission assignment
3. **Employees Management** - Full CRUD for employees
4. **Customers Management** - View/edit customers, KYC status, assignments
5. **Projects Management** - View/edit projects, milestones, status tracking
6. **Settings** - System configuration

### User Panel
1. **Dashboard** - Overview of projects and status
2. **My Projects** - List of all projects with details
3. **Project Details** - View project info, KYC, assigned team
4. **Designs** - View design files, BOQ, approve/reject
5. **Designer Portfolio** - View assigned designer's portfolio

## Implementation Notes

1. **JWT Authentication**: All requests except login/signup require Bearer token in Authorization header
2. **Password Security**: Passwords are hashed using bcrypt before storing
3. **Auto-generated IDs**: Employee IDs, Customer IDs, Project IDs, Design IDs are auto-generated
4. **File Uploads**: Design files and documents should be uploaded to cloud storage (AWS S3/Cloudinary)
5. **Pagination**: List endpoints support page, limit, search, and filter query parameters
6. **Error Handling**: All endpoints return consistent error format with status codes

## Security Best Practices

1. Use HTTPS in production
2. Implement rate limiting on auth endpoints
3. Validate all user inputs
4. Sanitize data before database operations
5. Log all admin actions for audit trail
6. Implement CSRF protection
7. Use secure session management
8. Regular security audits

## Getting Started

1. Create first admin user via direct database insertion or seed script
2. Admin logs in and creates employees
3. Admin creates customers linked to user accounts
4. Admin or CRM creates projects and assigns designer/CRM
5. Designer uploads designs with BOQ
6. Customer logs in to view and approve designs
7. Track project progress through milestones

