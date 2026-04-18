# Muheshimiwa-MD: Complete Architecture & Problem Analysis

## EXECUTIVE SUMMARY
**Muheshimiwa-MD** is a Next.js 15 web application for political constituency management (bursaries, projects, polling stations, impact tracking). It's built with modern TypeScript, tRPC for type-safe APIs, Prisma for database ORM, and NextAuth.js for authentication.

**Core Problem:** Admin login redirects back to login page after successful credentials authentication, preventing access to the admin dashboard.

---

## 1. TECHNOLOGY STACK

### Frontend
- **Next.js 15.5.15** with Turbopack (fast bundler)
- **React 19** for UI components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** (`@tanstack/react-query`) for client-side caching
- **NextAuth.js v5.0.0-beta** for authentication

### Backend
- **Next.js API Routes** + **tRPC v11** for type-safe RPC
- **Prisma v6.6.0** as ORM (manages database + migrations)
- **MySQL** database (hosted on Aiven Cloud)
- **Nodemailer** for email functionality
- **Zod** for runtime schema validation

### Infrastructure
- **Database:** MySQL on `mysql-fa6977c-lugayajoshua-f8e5.b.aivencloud.com:20405`
- **Port:** Dev server runs on `localhost:3000`

---

## 2. ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────┐
│                          BROWSER                                │
│  (Admin Login Form → Credentials → Redirect to /admin)          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Pages (Server Components + Client Components)           │   │
│  │  - /admin/page.tsx (server guard)                        │   │
│  │  - /admin-login/page.tsx (server redirector)             │   │
│  │  - /app/layout.tsx (root SessionProvider)                │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ API Routes (NextAuth + tRPC)                             │   │
│  │  - /api/auth/[...nextauth] → credentials provider        │   │
│  │  - /api/trpc/[trpc] → tRPC procedures                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Authentication Layer (NextAuth.js)                       │   │
│  │  - PrismaAdapter (stores sessions in DB)                 │   │
│  │  - CredentialsProvider (username + password)             │   │
│  │  - JWT Callbacks (enriches token with custom fields)     │   │
│  │  - Session Callbacks (enriches session object)           │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ tRPC API Routers (Type-Safe Backend)                     │   │
│  │  - postRouter                                            │   │
│  │  - mailingListRouter                                     │   │
│  │  - pollingStationRouter                                  │   │
│  │  - projectRouter                                         │   │
│  │  - bursaryDistributionRouter                             │   │
│  │  - impactStoryRouter                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MySQL)                              │
│  Tables:                                                         │
│   - User (id, name, email, phone, passwordHash, role, ward)    │
│   - Session (id, sessionToken, userId, expires)                │
│   - Account (OAuth provider accounts)                           │
│   - Post, Project, PollingStation, etc.                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. FILE STRUCTURE & KEY DIRECTORIES

```
src/
├── app/                          # Next.js App Router (pages & layouts)
│   ├── layout.tsx               # Root layout, SessionProvider setup
│   ├── page.tsx                 # Home page
│   ├── admin/                   # Admin dashboard (protected)
│   │   ├── page.tsx            # Server component with auth guard
│   │   └── _components/
│   │       └── admin-dashboard-content.tsx
│   ├── admin-login/             # Admin login page
│   │   ├── page.tsx            # Server-side login page
│   │   └── _actions.ts         # Server actions (not currently used)
│   ├── api/                     # API routes
│   │   ├── auth/[...nextauth]/ → NextAuth handlers
│   │   ├── trpc/[trpc]/        → tRPC RPC endpoint
│   │   └── admin/              → Admin-specific endpoints
│   └── _components/             # Shared components
│       ├── admin-login-form.tsx  # Client form (the problem)
│       ├── auth-nav.tsx         # Header navigation
│       └── ...
│
├── server/                       # Backend logic
│   ├── db.ts                    # Prisma client singleton
│   ├── auth/                    # Authentication
│   │   ├── index.ts            # auth() wrapper (cached with React.cache)
│   │   ├── config.ts           # NextAuth config
│   │   └── ...
│   ├── api/                     # tRPC setup
│   │   ├── root.ts             # Root tRPC router
│   │   ├── trpc.ts             # tRPC helper
│   │   └── routers/            # Individual routers
│   │       ├── post.ts
│   │       ├── project.ts
│   │       ├── polling-station.ts
│   │       └── ...
│   └── utils/
│       └── admin-auth.ts       # Password hashing utilities
│
└── trpc/
    ├── react.tsx               # React hooks for tRPC
    ├── server.ts               # Server tRPC utilities
    └── query-client.ts         # React Query setup

prisma/
├── schema.prisma               # Database schema
└── migrations/                 # DB migration history

generated/
└── prisma/                     # Prisma client (auto-generated)
```

---

## 4. DATA MODELS (Prisma Schema)

### Core Models

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  phone         String?   @unique
  passwordHash  String?   # scrypt-hashed admin password
  emailVerified DateTime?
  image         String?
  ward          String?   # constituency ward
  role          String    @default("voter")  # "voter" or "admin"
  
  accounts      Account[]  # OAuth providers
  sessions      Session[]  # Active sessions
  posts         Post[]     # Created posts
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique  # Cookie value
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  # OAuth provider accounts (not used for credentials)
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  # ... OAuth tokens ...
}
```

#### Public Data Models

```prisma
model Project {
  id          String   @id @default(cuid())
  title       String
  description String   @db.Text
  category    String   # "Bursaries", "Infrastructure", "Security"
  image       String?
  status      String   @default("active")  # active, completed, planned
  ward        String?
  impact      String?  # e.g., "5000 households"
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model PollingStation {
  id        String  @id @default(cuid())
  name      String
  code      String  @unique
  ward      String
  location  String  @db.Text
  latitude  Float?
  longitude Float?
  voters    Int     @default(0)
  status    String  @default("active")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int     @id @default(autoincrement())
  name      String
  createdBy User    @relation(fields: [createdById], references: [id])
  createdById String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

# Other models: BursaryDistribution, MailingList, ImpactStory
```

---

## 5. AUTHENTICATION FLOW (NextAuth.js v5)

### Configuration File: `src/server/auth/config.ts`

```typescript
export const authConfig = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // 1. Extract username/email and password
        const usernameOrEmail = credentials?.identifier ?? credentials?.email;
        const password = credentials?.password;
        
        // 2. Query database for admin user
        let adminUser = await db.user.findFirst({
          where: {
            role: "admin",
            OR: [{ email: usernameOrEmail }, { name: usernameOrEmail }],
          },
        });
        
        // 3. Verify password with scrypt hash
        if (adminUser?.passwordHash && verifyAdminPassword(password, adminUser.passwordHash)) {
          authenticated = true;
        }
        
        // 4. Fallback: Try env-based bootstrap credentials
        if (!authenticated && env.ADMIN_USERNAME && env.ADMIN_PASSWORD) {
          if (usernameOrEmail.toLowerCase() === env.ADMIN_USERNAME.toLowerCase() &&
              password === env.ADMIN_PASSWORD) {
            // Auto-create admin user with passwordHash
            adminUser = await db.user.create({...});
            authenticated = true;
          }
        }
        
        // 5. Return user object or null
        return authenticated ? { id: user.id, email, name, phone, ward } : null;
      },
    }),
  ],
  
  adapter: PrismaAdapter(db),  // Stores sessions in DB
  
  callbacks: {
    jwt: async ({ token, user }) => {
      // Add custom fields to JWT
      if (user) {
        token.phone = user.phone;
        token.ward = user.ward;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Enrich session object with token data
      return {
        ...session,
        user: {
          ...session.user,
          phone: token.phone,
          ward: token.ward,
        },
      };
    },
  },
  
  pages: {
    signIn: "/admin-login",
    error: "/admin-login",
  },
  
  trustHost: true,
  secret: env.AUTH_SECRET,  # Cryptographic secret
};
```

### Session Storage
When user logs in:
1. **POST `/api/auth/callback/credentials`** → NextAuth verifies credentials
2. **If valid:** Creates `Session` record in DB with unique `sessionToken`
3. **Sets cookie:** `next-auth.session-token` (httpOnly, secure)
4. **Client receives:** Session token in cookie
5. **On next request:** Browser sends cookie → Server verifies session exists in DB

### auth() Wrapper Function
```typescript
const auth = cache(uncachedAuth);  // React.cache() memoizes within request
export { auth };
```

**Problem:** The `cache()` wrapper might be storing "no session" state before it's created.

---

## 6. LOGIN FLOW (Current Implementation)

```
User Input (admin / Passw0rd!)
    ↓
[admin-login-form.tsx] Client Component
    ↓
await signIn("credentials", {
  identifier, password, redirect: false
})
    ↓
POST /api/auth/callback/credentials
    ↓
NextAuth CredentialsProvider.authorize()
    ↓
✅ Credentials Valid → Returns user object
    ↓
NextAuth creates Session in DB
    ↓
Sets next-auth.session-token cookie
    ↓
Returns { ok: true } to client
    ↓
Client waits 2000ms
    ↓
window.location.href = "/admin"
    ↓
🔴 PROBLEM: GET /admin → auth() returns null
    ↓
Redirects back to /admin-login
```

---

## 7. CURRENT PROBLEMS

### **PRIMARY ISSUE: Session Not Found After Login**

| Step | Status | Details |
|------|--------|---------|
| POST /api/auth/callback/credentials | ✅ 200 | Login succeeds, password verified |
| Session created in DB | ✅ (likely) | NextAuth creates Session record |
| Cookie set | ❓ Unclear | Browser may not have cookie ready |
| GET /admin | ❌ 307 Redirect | `auth()` returns null session |
| Redirect to /admin-login | ❌ Bounces back | User stuck in loop |

### **Root Causes (Hypotheses)**

1. **Cache Issue**
   - `React.cache(auth)` memoizes within a request
   - If `/admin` page calls `auth()` before session cookie is set, it caches `null`
   - Subsequent calls return cached `null` despite cookie being ready

2. **Session Cookie Timing**
   - NextAuth might not finalize the session cookie before client navigation
   - `window.location.href = "/admin"` happens too quickly
   - Server receives request before session is fully persisted

3. **Database Constraint or Session Query Issue**
   - Session might not be properly queryable immediately after creation
   - `PrismaAdapter` might have a race condition

4. **NextAuth v5 Beta Issues**
   - Using beta version of NextAuth might have undiscovered bugs
   - Session creation in PrismaAdapter might be async/delayed

### **Secondary Issues**

1. **Password Hashing:** Uses scrypt with 64-byte key (correct but custom)
2. **Error Handling:** No detailed error logging for why session fails
3. **UX:** 2-second delay after login is noticeable but necessary
4. **Testing:** No automated tests to verify login flow

---

## 8. KEY FILES & THEIR ROLES

| File | Purpose | Current State |
|------|---------|---------------|
| `src/app/admin/page.tsx` | Admin dashboard (protected) | Server component with auth guard |
| `src/app/admin-login/page.tsx` | Login entry point | Server component that redirects if authenticated |
| `src/app/_components/admin-login-form.tsx` | Login form UI | Client component - **THE BOTTLENECK** |
| `src/server/auth/config.ts` | NextAuth configuration | Properly configured credentials provider |
| `src/server/auth/index.ts` | Auth wrapper | Uses `React.cache()` (likely culprit) |
| `src/server/utils/admin-auth.ts` | Password utilities | Hashing/verification logic (correct) |
| `src/app/layout.tsx` | Root layout | SessionProvider setup |

---

## 9. ATTEMPTED SOLUTIONS & RESULTS

| Solution | Rationale | Result |
|----------|-----------|--------|
| Remove React.cache() | Allow fresh auth() calls | ❌ Database query errors |
| Add 1s delay before redirect | Give session time to settle | ❌ Still redirects back |
| Add 2s delay | More time for persistence | ❌ Still redirects back |
| Use signIn() with redirect: true | Let NextAuth handle redirect | ❌ Still redirects back |
| Use server action for login | Server-side redirect | ❌ Import errors |
| Increase sleep before auth() call | Wait for DB | ❌ No change |

**Conclusion:** Issue is not timing-related; it's a session state/detection issue.

---

## 10. REQUIRED NEXT STEPS FOR AI MODEL

To solve this, an AI debugging agent should:

1. **Trace the session creation:**
   - Add logging to `CredentialsProvider.authorize()`
   - Log when Session record is created
   - Log session cookie being set

2. **Verify cookie transmission:**
   - Check if `next-auth.session-token` cookie is sent back to browser
   - Verify cookie has correct domain/path/secure flags

3. **Debug auth() function:**
   - Log what `auth()` returns on `/admin` page
   - Compare session in cookies vs session in database
   - Check if `auth()` is querying the right session

4. **Examine NextAuth internals:**
   - Check if PrismaAdapter.getSessionAndUser() is working
   - Verify JWT encoding/decoding is correct
   - Look for race conditions in session persistence

5. **Consider alternative approaches:**
   - Use database direct query instead of NextAuth session
   - Implement custom session verification
   - Bypass NextAuth for admin-only routes

---

## 11. DEPLOYMENT & ENVIRONMENT

**Environment Variables Required:**
```
DATABASE_URL=mysql://user:pass@host:port/mejja?ssl-mode=REQUIRED
ADMIN_USERNAME=admin          # Bootstrap admin
ADMIN_PASSWORD=Passw0rd!      # Bootstrap password
AUTH_SECRET=<32-byte-base64>  # JWT signing key
NEXTAUTH_URL=http://localhost:3000
```

**Build & Run:**
```bash
npm install               # Install deps
npm run db:generate      # Generate Prisma client
npm run dev              # Start dev server (Turbopack)
npm run build            # Production build
npm run start            # Production server
```

---

## 12. SUMMARY FOR AI AGENT

**What works:**
- ✅ Credentials validation (password check succeeds)
- ✅ NextAuth callback receives credentials
- ✅ User DB lookups work
- ✅ Session table exists and can be written
- ✅ Database connection is stable

**What's broken:**
- ❌ After successful login, `auth()` on `/admin` doesn't find the session
- ❌ Session either not persisted or not queryable by NextAuth
- ❌ Cookie set/retrieval issue or cache mismatch

**Priority fixes:**
1. Debug PrismaAdapter session creation/retrieval
2. Verify cookie is actually being sent/received
3. Check if switching from beta NextAuth v5 to stable version helps
4. Add comprehensive logging to entire auth chain
