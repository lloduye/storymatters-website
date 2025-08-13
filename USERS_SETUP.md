# Users Management Setup Guide

## Google Sheets Structure

To use the Users management system, you need to create a "Users" sheet in your Google Spreadsheet with the following columns:

### Column Structure (A through L):

| Column | Header      | Description            | Example                      |
| ------ | ----------- | ---------------------- | ---------------------------- |
| A      | ID          | Unique user identifier | user_1703123456789_abc123def |
| B      | Username    | User's login username  | john_doe                     |
| C      | Email       | User's email address   | john@example.com             |
| D      | Full Name   | User's full name       | John Doe                     |
| E      | Role        | User's role in system  | admin, manager, user         |
| F      | Status      | User's account status  | active, inactive, pending    |
| G      | Created At  | When user was created  | 2024-01-15T10:30:00.000Z     |
| H      | Last Login  | Last login timestamp   | 2024-01-20T14:45:00.000Z     |
| I      | Permissions | User permissions       | read, write, delete          |
| J      | Phone       | User's phone number    | +1234567890                  |
| K      | Department  | User's department      | Marketing                    |
| L      | Notes       | Additional notes       | New team member              |

### Setup Steps:

1. **Open your Google Spreadsheet**
2. **Create a new sheet named "Users"**
3. **Add the header row** with the column names above
4. **Set column A (ID) as the primary key** - this should be unique for each user
5. **Format the Created At and Last Login columns** as Date/Time for better readability

### Sample Data:

```
ID                              | Username    | Email           | Full Name | Role   | Status | Created At                    | Last Login                   | Permissions | Phone        | Department | Notes
user_1703123456789_abc123def   | admin       | admin@site.com  | Admin User| admin  | active | 2024-01-15T10:30:00.000Z    | 2024-01-20T14:45:00.000Z   | all         | +1234567890  | IT         | System administrator
user_1703123456790_def456ghi   | manager1    | mgr@site.com    | John Doe  | manager| active | 2024-01-16T09:15:00.000Z    | 2024-01-19T16:20:00.000Z   | read,write  | +1234567891  | Marketing  | Team lead
user_1703123456791_ghi789jkl   | user1       | user@site.com   | Jane Smith| user   | active | 2024-01-17T11:00:00.000Z    | 2024-01-18T13:30:00.000Z   | read        | +1234567892  | Sales      | New hire
```

## Features Available:

### ✅ **User Management:**

- Create new users with full profile information
- Edit existing user details
- View comprehensive user profiles
- Delete users (with confirmation)

### ✅ **Role Management:**

- Admin: Full system access
- Manager: Limited administrative access
- User: Basic access

### ✅ **Status Management:**

- Active: User can access the system
- Inactive: User account is disabled
- Pending: User account awaiting activation

### ✅ **Advanced Features:**

- Search users by name, username, or email
- Filter by role and status
- Bulk status updates
- Permission management
- Department organization
- Activity tracking (creation date, last login)

### ✅ **Data Validation:**

- Required fields validation
- Email format validation
- Unique username enforcement
- Role and status constraints

## API Endpoints:

The system provides these REST API endpoints:

- `GET /api/users` - Fetch all users
- `GET /api/users/:id` - Fetch specific user
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/status` - Update user status

## Security Features:

- User authentication required for all operations
- Role-based access control
- Input validation and sanitization
- Secure API endpoints
- Audit trail for user changes

## Usage Tips:

1. **Start with admin users** - Create at least one admin account first
2. **Use descriptive usernames** - Avoid generic names like "user1", "user2"
3. **Set appropriate permissions** - Only grant necessary access levels
4. **Regular status updates** - Keep user statuses current
5. **Department organization** - Use consistent department names
6. **Notes field** - Document important information about users

## Troubleshooting:

- **Users not loading**: Check Google Sheets API credentials and permissions
- **Create user fails**: Verify all required fields are filled
- **Update fails**: Ensure user ID exists in the sheet
- **Delete fails**: Check if user has active dependencies

## Next Steps:

1. Set up your Google Sheets with the Users structure
2. Test creating a few sample users
3. Verify all CRUD operations work correctly
4. Customize roles and permissions as needed
5. Train your team on user management procedures
