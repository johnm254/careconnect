

# Hospital Management System - MVP

A modern, minimal hospital management system with role-based access for Admin, Doctor, Nurse, and Receptionist. Built as a functional prototype with demo data.

---

## 1. Authentication & Role Selection

- **Login Page** with clean, professional design
- **Role selector** to switch between Admin, Doctor, Nurse, and Receptionist views
- Each role sees a customized dashboard and navigation based on their permissions

---

## 2. Dashboard (Home)

A visual overview with key metrics and charts:

- **Quick Stats Cards**: Total patients, today's appointments, pending bills, available beds
- **Appointments Chart**: Visual graph showing appointments over the week
- **Recent Activity Feed**: Latest patient registrations, completed appointments
- **Quick Actions**: Buttons for common tasks (add patient, new appointment, etc.)

---

## 3. Patient Management

Complete patient registry and records:

- **Patient List**: Searchable, sortable table with patient info
- **Patient Profile**: Detailed view with personal info, medical history, visit timeline
- **Add/Edit Patient Form**: Register new patients with contact, emergency info, and insurance details
- **Patient Search**: Quick lookup by name, ID, or phone number

---

## 4. Appointment Scheduling

Manage doctor appointments efficiently:

- **Calendar View**: Visual calendar showing all appointments
- **Appointment List**: Table view with filters (by doctor, date, status)
- **Book Appointment**: Form to schedule with patient, doctor, date/time, and reason
- **Status Management**: Pending, Confirmed, Completed, Cancelled states

---

## 5. Doctor/Staff Directory

Organized staff information:

- **Staff Cards**: Grid of doctors and nurses with photos, specialization, availability
- **Staff Profiles**: Detailed view with contact info, schedule, and department
- **Department Filters**: Filter by Cardiology, Pediatrics, General Medicine, etc.
- **Availability Indicator**: Show who's available today

---

## 6. Billing & Invoicing

Track payments and generate invoices:

- **Invoice List**: All bills with status (paid, pending, overdue)
- **Create Invoice**: Generate bills linked to patient visits and services
- **Invoice Details**: Itemized breakdown of charges
- **Payment Status Tracking**: Mark invoices as paid/pending

---

## 7. Role-Based Navigation

Each role sees relevant features:

| Feature | Admin | Doctor | Nurse | Receptionist |
|---------|-------|--------|-------|--------------|
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| All Patients | ✓ | View Own | View Assigned | ✓ |
| Appointments | ✓ | View Own | View All | Manage All |
| Staff Directory | ✓ | ✓ | ✓ | ✓ |
| Billing | ✓ | View Only | – | ✓ |
| Settings | ✓ | – | – | – |

---

## Design Style

- **Modern & Minimal**: Clean white backgrounds, generous spacing, subtle shadows
- **Color Palette**: Calming blue as primary, with green for success states
- **Typography**: Clear, readable fonts with proper hierarchy
- **Responsive**: Works on desktop and tablet devices

