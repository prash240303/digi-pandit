# DIGIPANDIT Backend

A scalable Go backend for the DIGIPANDIT Hindu religious practices mobile app, featuring Supabase authentication and OAuth support.

## Tech Stack

- **Language**: Go 1.21+
- **Router**: Chi v5
- **Auth**: Supabase (GoTrue)
- **Validation**: go-playground/validator

## Project Structure

```
backend/
├── cmd/server/          # Application entry point
├── internal/
│   ├── auth/            # Authentication handlers, middleware, service
│   ├── config/          # Configuration management
│   ├── database/        # Supabase client
│   └── user/            # User profile management
├── api/                 # Route definitions
└── pkg/response/        # Shared response utilities
```

## Getting Started

### Prerequisites

- Go 1.21 or later
- A Supabase project with Auth enabled

### Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in `.env`:**
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-role-key
   JWT_SECRET=your-jwt-secret  # From Supabase dashboard
   ```

4. **Install dependencies:**
   ```bash
   go mod download
   ```

5. **Run the server:**
   ```bash
   go run cmd/server/main.go
   ```

## API Endpoints

### Health Check
- `GET /api/v1/health` - Server health status

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register with email/password |
| POST | `/api/v1/auth/signin` | Login with email/password |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| POST | `/api/v1/auth/signout` | Sign out (protected) |
| GET | `/api/v1/auth/oauth` | Get OAuth URL |
| POST | `/api/v1/auth/oauth/verify` | Verify OAuth token |
| GET | `/api/v1/auth/me` | Get current user (protected) |

### User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get profile (protected) |
| PUT | `/api/v1/users/me` | Update profile (protected) |
| DELETE | `/api/v1/users/me` | Delete account (protected) |

## Supabase Setup

### 1. Create profiles table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  phone TEXT,
  full_name TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  zodiac_sign TEXT,
  region TEXT,
  language TEXT DEFAULT 'en',
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expiry TIMESTAMPTZ,
  notify_festival BOOLEAN DEFAULT TRUE,
  notify_daily BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Enable OAuth Providers

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google and/or Apple
3. Configure OAuth credentials

## Development

```bash
# Run with hot reload (using air)
air

# Run tests
go test ./...

# Build binary
go build -o bin/server cmd/server/main.go
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 8080) | No |
| `ENV` | Environment (development/production) | No |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role key | Yes |
| `JWT_SECRET` | JWT secret from Supabase | Yes |
| `ALLOWED_ORIGINS` | CORS origins (comma-separated) | No |
