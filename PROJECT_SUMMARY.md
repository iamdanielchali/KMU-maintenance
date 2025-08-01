# KMU Hostel Maintenance System - Project Summary

## Project Overview
A comprehensive web-based hostel maintenance reporting system designed for Kapasa Makasa University (KMU). The system enables students to submit maintenance requests and provides administrators with a secure dashboard to manage and track these requests.

## Key Features

### Student Interface
- **Easy Report Submission**: Simple form for students to submit maintenance requests
- **Image Upload**: Students can attach photos of issues
- **Ticket Generation**: Automatic ticket number generation for tracking
- **Contact Information**: Students provide their contact details for follow-up

### Administrator Dashboard
- **Secure Authentication**: Bcrypt-hashed password protection
- **Comprehensive Management**: View, edit, and manage all maintenance reports
- **Advanced Search & Filtering**: Search by ticket, hostel, room, issue type, or description
- **Status Management**: Update report status (Pending, In Progress, Resolved)
- **Export Functionality**: Export reports to Excel (.xlsx) and Word (.docx) formats
- **Real-time Statistics**: Dashboard showing total, pending, in-progress, and resolved reports
- **Image Viewing**: View uploaded issue images directly in the dashboard
- **Ticket Number Management**: Customize ticket numbers for each report

## Technical Specifications

### Backend Technologies
- **Node.js**: Server runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database (with configuration for MySQL/PostgreSQL)
- **Mongoose**: MongoDB object modeling
- **bcrypt**: Password hashing (12 salt rounds)
- **express-session**: Session management
- **multer**: File upload handling

### Frontend Technologies
- **HTML5/CSS3**: Modern web standards
- **Bootstrap 5**: Responsive UI framework
- **JavaScript**: Client-side functionality
- **Font Awesome**: Icon library
- **XLSX/DOCX**: Export libraries

### Security Features
- **Password Hashing**: All passwords secured with bcrypt
- **Session Management**: Secure session-based authentication
- **Protected Routes**: API endpoints require authentication
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Secure image upload handling

## Database Schema

### Admin Collection
```javascript
{
  username: String (unique),
  password: String (bcrypt hashed),
  name: String,
  role: String (default: 'admin'),
  createdAt: Date
}
```

### Reports Collection
```javascript
{
  hostel: String,
  room: String,
  issueType: String,
  description: String,
  contact: String,
  image: String (filename),
  ticketNumber: String,
  status: String (Pending/InProgress/Resolved),
  date: Date
}
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (or MySQL/PostgreSQL)
- npm package manager

### Quick Start
1. Clone/extract the project
2. Run `npm install`
3. Start MongoDB
4. Run `node setup-admin.js` to create admin account
5. Start server with `node server.js`
6. Access at `http://localhost:3000`

## Deployment Options

### Option 1: MongoDB (Default)
- Works out of the box
- No additional configuration required
- Free and widely supported

### Option 2: MySQL/PostgreSQL
- Modify `config/database.js`
- Update environment variables
- Install additional dependencies

## KMU Domain Integration

### Subdomain Option (Recommended)
- **URL**: `maintenance.kmu.ac.zm`
- **DNS**: A record pointing `maintenance` to server IP
- **SSL**: Certificate for `maintenance.kmu.ac.zm`
- **Access**: Direct subdomain access

### Subdirectory Option
- **URL**: `kmu.ac.zm/maintenance`
- **DNS**: A record pointing `kmu.ac.zm` to server IP
- **SSL**: Certificate for `kmu.ac.zm`
- **Access**: Integrated with main KMU website

## API Endpoints

### Public Endpoints
- `POST /api/report` - Submit maintenance report

### Protected Endpoints
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/status` - Check authentication
- `GET /api/reports` - Get all reports
- `PATCH /api/reports/:id/status` - Update report status
- `PATCH /api/reports/:id/ticket` - Update ticket number
- `DELETE /api/reports/:id` - Delete report
- `GET /api/reports/export` - Export reports data

## File Structure
```
kmu-hostel-maintenance/
├── server.js              # Main server file
├── package.json           # Dependencies
├── setup-admin.js         # Admin creation script
├── env.example            # Environment variables example
├── config/
│   └── database.js        # Database configuration
├── public/                # Frontend files
│   ├── index.html         # Student form
│   ├── warden.html        # Admin dashboard
│   ├── admin-login.html   # Admin login
│   └── assets/            # Images and assets
├── uploads/               # Uploaded images
└── README.md              # Complete documentation
```

## Benefits for KMU

### Operational Efficiency
- **Streamlined Process**: Digital submission eliminates paper-based requests
- **Real-time Tracking**: Instant visibility of maintenance status
- **Automated Workflow**: Ticket generation and status updates
- **Data Export**: Easy reporting and analysis capabilities

### Cost Savings
- **Reduced Administrative Overhead**: Automated ticket management
- **Better Resource Allocation**: Data-driven maintenance planning
- **Improved Response Times**: Faster issue identification and resolution

### Student Satisfaction
- **Easy Access**: Simple web interface for report submission
- **Transparency**: Students can track their request status
- **Better Communication**: Clear ticket numbers for reference

### Data Management
- **Centralized Database**: All maintenance data in one place
- **Historical Records**: Complete maintenance history
- **Analytics Ready**: Export capabilities for reporting

## Security & Compliance
- **Data Protection**: Secure password storage and session management
- **Access Control**: Role-based authentication
- **Audit Trail**: Complete logging of all actions
- **Scalable Architecture**: Easy to extend and modify
- **KMU Domain Integration**: Institutional branding and security

## Support & Maintenance
- **Well-Documented**: Comprehensive README and inline comments
- **Modular Design**: Easy to maintain and extend
- **Database Agnostic**: Can work with various database systems
- **Environment Configurable**: Flexible deployment options
- **KMU IT Integration**: Works with existing institutional infrastructure

## Future Enhancements
- **Email Notifications**: Automated status updates via KMU email
- **Mobile App**: Native mobile application
- **Advanced Analytics**: Dashboard with charts and reports
- **Multi-language Support**: Internationalization
- **API Integration**: Connect with existing KMU systems
- **LDAP Integration**: KMU staff directory authentication

## KMU Branding Integration
- **Institutional Logo**: KMU branding throughout the system
- **Color Scheme**: KMU brand colors (Blue, Gold, Red)
- **Domain Integration**: Seamless integration with kmu.ac.zm
- **Email Integration**: KMU email system integration
- **Security Policies**: Compliance with KMU security standards

---

**Contact Information**
For technical support or questions about this system, please refer to the README.md file for detailed setup instructions and contact information.

**Version**: 1.0.0
**Last Updated**: June 2025
**Technology Stack**: Node.js, Express, MongoDB, Bootstrap 5
**Institution**: Kapasa Makasa University (KMU)
**Domain**: kmu.ac.zm 