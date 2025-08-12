# S.E.F. Contact Engine CRM

A comprehensive debt collection Customer Relationship Management (CRM) system with separated Admin and Agent portals, featuring portfolio management, payment processing, and consumer profile management.

## 🚀 Features

### Admin Portal
- **Master Dashboard** with portfolio insights and system-wide metrics
- **Portfolio Management** with upload, assignment, and tracking capabilities
- **Agent Management** with role-based access control
- **Payment Calendar** with visual indicators and comprehensive oversight
- **Data Export & Reports** with masking options for sensitive information
- **System Administration** tools and audit capabilities

### Agent Portal
- **Agent-Specific Dashboard** showing assigned accounts only
- **Consumer Profile Management** with quick access (Alt+C shortcut)
- **Payment Processing** with various payment methods
- **Task Management** with priority-based workflow
- **Limited Reporting** focused on individual agent performance
- **Quick Actions** for efficient daily operations

### Shared Features
- **Emergency Reset** functionality (Ctrl+Shift+R)
- **Smart Search** with highlighting across all data
- **Responsive Design** for mobile, tablet, and desktop
- **Role-Based Access Control** with secure data isolation
- **Real-time Notifications** and status updates
- **Accessibility Features** with ARIA labels and keyboard navigation

## 🎨 Design System

### Brand Colors
- **Background**: `#101419` (Dark navy)
- **Primary**: `#1ECBE1` (Cyan blue)
- **Accent**: `#3AFCA0` (Bright green)
- **Secondary**: `#FF9533` (Orange)

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Responsive scaling** with mobile-first approach

## 📁 File Structure

```
ContactEngine/
├── admin-portal.html          # Admin interface with full dashboard
├── agent-portal.html          # Agent interface with limited scope
├── css/
│   └── shared-styles.css      # Common styling for both portals
├── js/
│   ├── shared-functions.js    # Common functionality
│   ├── admin-functions.js     # Admin-specific features
│   ├── agent-functions.js     # Agent-specific features
│   └── calendar-functions.js  # Calendar and payment processing
└── README.md                  # This documentation
```

## 🚀 Getting Started

### Quick Start
1. Open `admin-portal.html` for administrative functions
2. Open `agent-portal.html` for agent operations
3. Use the role selector to switch between portals
4. Use Alt+C for quick consumer search in agent portal

### Role Management
- **Admin**: Full system access with portfolio and user management
- **Agent1** (John Smith): Limited to assigned accounts and payments
- **Agent2** (Sarah Jones): Limited to assigned accounts and payments

## 🔧 Key Functionality

### Portfolio Management (Admin Only)
- Upload portfolios via CSV/Excel files
- Assign portfolios to specific agents
- Track recovery rates and performance metrics
- Generate comprehensive reports with masking options

### Consumer Management
- Detailed consumer profiles with contact information
- Account status tracking and update capabilities
- Payment history and balance management
- Note-taking system with timestamps and categories

### Payment Processing
- Multiple payment methods (Credit Card, Bank Transfer, ACH, Check, Cash)
- Visual payment calendar with status indicators
- Automatic balance updates and transaction logging
- Export capabilities with data masking for compliance

### Search & Navigation
- Smart search with real-time highlighting
- Quick consumer access via Alt+C shortcut
- Filtering and sorting across all data tables
- Responsive navigation for mobile devices

## ⌨️ Keyboard Shortcuts

### Global Shortcuts
- **Alt+C**: Quick consumer search and access
- **Ctrl+Shift+R**: Emergency system reset
- **Escape**: Close current modal

### Admin Portal Shortcuts
- **Ctrl+Shift+P**: Portfolio upload
- **Ctrl+Shift+U**: User management
- **Ctrl+Shift+D**: Download options

### Agent Portal Shortcuts
- **Ctrl+Shift+Q**: Quick payment entry
- **Ctrl+Shift+T**: Task management

## 🔒 Security & Compliance

### Data Protection
- Sensitive data masking in exports (SSN, Account numbers)
- Role-based access restrictions
- Audit logging for compliance
- Secure session management

### Privacy Features
- Consumer data isolation by agent assignment
- Optional data masking in all export functions
- Controlled access to sensitive information
- GDPR-compliant data handling

## 📊 Reporting & Analytics

### Admin Reports
- Portfolio performance analysis
- Agent performance metrics
- Recovery rate tracking
- System-wide analytics

### Agent Reports
- Individual performance metrics
- Assigned account summaries
- Personal success rate tracking
- Task completion statistics

## 🔧 Technical Requirements

### Browser Support
- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browser support for responsive design

### Dependencies
- No external JavaScript libraries required
- Pure CSS with CSS Grid and Flexbox
- LocalStorage for session management

## 🐛 Troubleshooting

### Emergency Reset
If the system becomes unresponsive:
1. Press **Ctrl+Shift+R** for emergency reset
2. Click the "🚨 Emergency Reset" button in the top bar
3. Refresh the page if needed

### Common Issues
- **Modal stuck open**: Use emergency reset or press Escape
- **Search not working**: Clear the search field and try again
- **Data not loading**: Refresh the page or use the refresh buttons

## 🔄 Auto-Refresh Features

### Admin Portal
- Dashboard metrics refresh every 30 seconds
- Real-time activity updates
- Automatic session management

### Agent Portal
- Performance metrics refresh every 60 seconds
- Task list updates
- Payment status synchronization

## 📱 Mobile Support

### Responsive Features
- Optimized layouts for mobile devices
- Touch-friendly interface elements
- Simplified navigation for small screens
- Accessible form controls

### Mobile-Specific Optimizations
- Simplified table layouts
- Collapsible sections
- Touch gesture support
- Mobile-optimized modals

## 🎯 Best Practices

### For Administrators
1. Regularly backup data using export functions
2. Monitor agent performance through dashboard metrics
3. Use data masking for sensitive information exports
4. Review system activity logs periodically

### For Agents
1. Use Alt+C for quick consumer access
2. Update account status after each interaction
3. Add detailed notes for better follow-up
4. Check payment calendar daily for due payments

## 🔮 Future Enhancements

### Planned Features
- Advanced analytics dashboard
- Integration with external payment processors
- Automated workflow triggers
- Enhanced reporting capabilities
- API integration for third-party systems

### Customization Options
- Configurable dashboard layouts
- Custom report templates
- Personalized notification settings
- Themeable interface options

## 📧 Support

For technical support or feature requests, contact the development team or create an issue in the repository.

---

**S.E.F. Contact Engine CRM** - Streamlining debt collection operations with modern web technology.
