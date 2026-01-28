# Property Management Software - Dashboard Specification

## Overview
This document defines the core models and dashboard components for our property management software.

## Core Models

### User
The user is the person who can create an account in our application or software.
- **Attributes to consider**: name, email, role (owner/tenant/admin), contact information, authentication details

### Property
A property can be a house, building, or any other real estate that can be rented.
- **Attributes to consider**: address, type, owner, total units, amenities, images

### Apartment
The different units/frames that compose the property.
- **Attributes to consider**: unit number, size, bedrooms, bathrooms, floor, status (occupied/vacant)

### Rent
A fixed amount that must be paid each month for a property or apartment.
- **Attributes to consider**: amount, due date, payment status, late fees, payment method

### Rental Contract/Duration
A contract that defines the rental agreement and must be honored each month.
- **Attributes to consider**: start date, end date, tenant, property/apartment, terms and conditions, deposit amount

## Additional Models to Consider

### Payment
Track individual payment transactions.
- Attributes: amount, date paid, payment method, reference number, associated rent

### Maintenance Request
Track repair and maintenance issues.
- Attributes: description, status, priority, date reported, date resolved, cost

### Document
Store important files and contracts.
- Attributes: type, upload date, associated property/user, file path

## Dashboard Components

### Dashboard Overview
The dashboard is the main section showing a summary of recent activities.

**Key Metrics to Display:**
- Total properties
- Total apartments/units
- Occupancy rate
- Monthly revenue
- Pending payments
- Outstanding maintenance requests

**Recent Activities to Show:**
- New rental agreements
- Recent payments received
- Upcoming rent due dates
- Recent maintenance requests
- New user registrations

**Visual Elements:**
- Charts showing revenue trends
- Occupancy statistics
- Payment status overview
- Quick action buttons (Add Property, New Tenant, etc.)

## Next Steps
- Define detailed data schema for each model
- Design database relationships
- Create wireframes for dashboard UI
- Identify required user permissions and roles


# Sidebar Navigation Structure

## Main Navigation Items

### 📊 Dashboard
- Overview/Home with key metrics and recent activities

### 🏢 Properties
- All Properties (list view)
- Add New Property
- Property Categories/Types

### 🏠 Apartments/Units
- All Units (list view)
- Add New Unit
- Vacant Units
- Occupied Units

### 👥 Users/Tenants
- All Tenants
- Add New Tenant
- Tenant Requests
- User Management (if admin)

### 💰 Finances
- Rent Collection
- Payment History
- Pending Payments
- Overdue Payments
- Revenue Reports
- Expenses

### 📝 Contracts
- Active Contracts
- Expiring Soon
- Create New Contract
- Contract Templates

### 🔧 Maintenance
- All Requests
- Pending Requests
- In Progress
- Completed
- Create New Request

### 📄 Documents
- All Documents
- Contracts
- Invoices
- Reports

### 📊 Reports
- Financial Reports
- Occupancy Reports
- Maintenance Reports
- Custom Reports

### ⚙️ Settings
- Profile Settings
- Company/Organization Info
- Notifications
- Preferences

### 🔔 Notifications (with badge for unread count)

### ❓ Help & Support

---

## Recommended Sidebar Structure (Simplified)

For a cleaner interface, you might want to group items: