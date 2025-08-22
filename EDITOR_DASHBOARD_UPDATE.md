# Editor Dashboard Update

## Overview

The Editor Dashboard has been updated to provide a split view with "All Stories" and "My Stories" sections, along with user-specific permissions that ensure editors can only edit and publish their own stories.

## New Features

### 1. Split View Interface

- **All Stories Tab**: Shows all stories in the system (read-only for other users' stories)
- **My Stories Tab**: Shows only stories created by the logged-in user (full edit permissions)

### 2. User-Specific Permissions

- Editors can only edit, publish, or modify stories they created
- Other users' stories are displayed as "Read only"
- Clear visual indicators show which actions are available

### 3. Enhanced User Authentication

- Proper user authentication with user data storage
- User information displayed in the dashboard header
- User-specific story filtering

## Technical Changes

### Backend Updates (server/index.js)

1. **Story Structure**: Using existing `author` field to track story ownership
2. **New API Endpoint**: `/api/stories/user/:username` to fetch user-specific stories
3. **User Authentication**: Enhanced login system with user data

### Frontend Updates (src/pages/cms/EditorDashboard.js)

1. **Split State Management**: Separate state for all stories and user stories
2. **Permission System**: `canEditStory()` function to check edit permissions using author field
3. **Tab Navigation**: Toggle between "All Stories" and "My Stories"
4. **User Context**: Integration with AuthContext for user information

### Authentication Updates (src/contexts/AuthContext.js)

1. **User Data Storage**: Added user state management
2. **Enhanced Login**: Store user information during login
3. **Persistent User Data**: User data persists across sessions

## Database Schema Updates

### Stories Sheet (Google Sheets)

Using existing column:

- **Column C**: `author` - Author name (used to identify story ownership)

### Users Sheet (Google Sheets)

Existing structure maintained with proper user authentication.

## Setup Instructions

### 1. Google Sheets Structure

The system uses the existing `author` column to identify story ownership. No additional columns are needed:

```
A1: title
B1: excerpt
C1: author
D1: location
E1: publishDate
F1: image
G1: category
H1: readTime
I1: content
J1: tags
K1: featured
L1: createdAt
```

### 2. Add Sample Data

Run the sample data script to test the functionality:

```bash
node add-sample-data.js
```

This will create:

- 3 test users (2 editors, 1 admin)
- 4 sample stories (2 per editor, using their full names as authors)

### 3. Test Credentials

After running the sample data script:

- **Editor 1**: `editor1` / `password123`
- **Editor 2**: `editor2` / `password123`
- **Admin**: `admin` / `password123`

## Testing the Functionality

### 1. Login as Editor 1

1. Go to `/admin/login`
2. Login with `editor1` / `password123`
3. Navigate to Editor Dashboard

### 2. Test Split View

1. **All Stories Tab**: Should show all 4 stories
   - Editor 1's stories: Full edit permissions
   - Editor 2's stories: Read-only (shows "Read only" in actions)
2. **My Stories Tab**: Should show only Editor 1's 2 stories with full permissions

### 3. Test Permissions

1. Try to edit Editor 2's stories from "All Stories" tab
2. Should see error message: "You can only edit your own stories"
3. Your own stories should allow full editing

### 4. Test Story Management

1. Toggle story status (publish/draft)
2. Toggle featured status
3. Preview stories
4. All actions should work for your stories, be restricted for others

## User Experience

### Visual Indicators

- **User Information**: Displayed in dashboard header
- **Story Count**: Shows total stories and "My Stories" count
- **Tab Navigation**: Clear indication of active tab with story counts
- **Action Buttons**: Disabled or show "Read only" for unauthorized actions

### Permission Feedback

- **Success Messages**: Confirmation for successful actions
- **Error Messages**: Clear feedback when permissions are denied
- **Visual Cues**: Different styling for editable vs read-only stories

## Security Features

### 1. Server-Side Validation

- User authentication required for all story operations
- Story ownership verification before allowing edits
- API endpoints validate user permissions

### 2. Client-Side Protection

- Permission checks before showing action buttons
- User context validation
- Graceful handling of unauthorized actions

### 3. Data Integrity

- Story ownership tracking via `author` field
- User data persistence and validation
- Secure authentication flow

## Future Enhancements

### Potential Improvements

1. **Story Collaboration**: Allow multiple editors to work on stories
2. **Approval Workflow**: Add review/approval process for story publishing
3. **Advanced Filtering**: Filter by date, category, status, etc.
4. **Bulk Operations**: Select multiple stories for bulk actions
5. **Story Templates**: Pre-defined templates for different story types

### Technical Improvements

1. **Real-time Updates**: WebSocket integration for live updates
2. **Offline Support**: Service worker for offline story editing
3. **Advanced Search**: Full-text search with filters
4. **Export Features**: Export stories in various formats
5. **Analytics**: Detailed story performance metrics

## Troubleshooting

### Common Issues

1. **Stories not loading**

   - Check Google Sheets API credentials
   - Verify sheet structure includes `createdBy` column
   - Check network connectivity

2. **Permission errors**

   - Ensure user is properly logged in
   - Verify user data is stored in AuthContext
   - Check story `author` field matches user's full name

3. **Login issues**

   - Verify user exists in Users sheet
   - Check password hashing is working
   - Ensure proper API endpoint configuration

4. **Missing user data**
   - Clear browser storage and re-login
   - Check AuthContext implementation
   - Verify login API response includes user data

### Debug Steps

1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Google Sheets for data integrity
4. Test with different user accounts
5. Verify environment variables are set correctly

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Verify all setup steps are completed
3. Test with sample data first
4. Check server logs for detailed error messages
