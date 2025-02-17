# Google OAuth 2.0 Setup Instructions

To enable Google Sign-In functionality, you need to set up the following environment variables:

## Backend (.env)
```
GOOGLE_CLIENT_ID=your-google-client-id
JWT_SECRET=your-jwt-secret
```

## Frontend (.env)
```
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## Steps to obtain Google Client ID:
1. Go to the Google Cloud Console (https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to Credentials
5. Create an OAuth 2.0 Client ID
6. Add authorized JavaScript origins:
   - http://localhost:5173 (for Vite dev server)
   - Your production URL
7. Add authorized redirect URIs:
   - http://localhost:5173
   - Your production URL
8. Copy the Client ID and add it to both frontend and backend .env files

## Common Issues:
1. Make sure GOOGLE_CLIENT_ID is identical in both frontend and backend
2. Ensure the Google API client is properly initialized before use
3. Check if your domain/origin is authorized in Google Cloud Console
4. Verify that the Google OAuth2 API is enabled in Google Cloud Console
5. Make sure you're using HTTPS in production

For development, the application should now work with Google Sign-In at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8080