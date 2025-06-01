# Environment Variables Setup

## Creating the .env file

To improve security, this project uses environment variables to store sensitive Supabase credentials.

### Step 1: Create the .env file

In the root directory of your project, create a file named `.env` with the following content:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://jxcvonbmosywkqtomrbl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y3ZvbmJtb3N5d2txdG9tcmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Mjc2NTYsImV4cCI6MjA2NDAwMzY1Nn0.L3oc3QtOnBBqxVIhiLimQub3LBG_GJWmw_SV-fkXGfU
```

### Step 2: Verify setup

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

### Important Notes

- The `.env` file is already added to `.gitignore` to prevent credentials from being committed to version control
- The application includes fallback values, so it will still work without the `.env` file, but using environment variables is more secure
- In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser
- Never commit your `.env` file to version control

### For Production/Deployment

When deploying your application, make sure to set these environment variables in your hosting platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Finding Your Supabase Credentials

If you need to find your Supabase credentials:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### Security Benefits

Using environment variables provides several security benefits:

- Credentials are not hardcoded in source code
- Different environments can use different credentials
- Credentials are not accidentally committed to version control
- Team members can use their own development credentials 