# Execute Database Setup - Step by Step

## Overview
This document provides detailed instructions to execute the three SQL files to set up your complete database.

## Method 1: Supabase SQL Editor (Recommended)

### Step 1: Navigate to SQL Editor
1. Go to Supabase Dashboard
2. Select your project
3. Click "SQL Editor" in left sidebar
4. Click "New Query"

### Step 2: Execute Create Tables Script
1. Copy all content from `scripts/01_create_tables.sql`
2. Paste into SQL Editor
3. Click "Run" or press `Ctrl+Enter`
4. Wait for completion (should show: "Tables created successfully")

**Expected Output:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
...
CREATE INDEX
...
```

### Step 3: Execute Data Insert Script
1. Create new query
2. Copy all content from `scripts/02_insert_data.sql`
3. Paste into SQL Editor
4. Click "Run"
5. Wait for completion

**Expected Output:**
```
INSERT 0 7  (users)
INSERT 0 24 (services)
INSERT 0 4  (categories)
INSERT 0 3  (promos)
INSERT 0 3  (offers)
UPDATE 4
```

### Step 4: Execute RLS Policies Script
1. Create new query
2. Copy all content from `scripts/03_rls_policies.sql`
3. Paste into SQL Editor
4. Click "Run"

**Expected Output:**
```
ALTER TABLE
ALTER TABLE
CREATE POLICY
CREATE POLICY
...
```

## Method 2: psql Command Line

### Prerequisites
```bash
# Install psql client
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### Get Connection String
1. Go to Supabase Dashboard
2. Click Settings → Database
3. Find "Connection String" under "PostgreSQL URI"
4. Copy the connection string

### Execute Commands
```bash
# Navigate to project directory
cd /path/to/project

# Execute all three scripts in order
psql "<YOUR_CONNECTION_STRING>" -f scripts/01_create_tables.sql
psql "<YOUR_CONNECTION_STRING>" -f scripts/02_insert_data.sql
psql "<YOUR_CONNECTION_STRING>" -f scripts/03_rls_policies.sql
```

Replace `<YOUR_CONNECTION_STRING>` with your actual connection string.

## Method 3: Node.js Script

Create `scripts/run-migrations.js`:

```javascript
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  try {
    console.log('Starting database migrations...')

    // Read SQL files
    const createTablesSql = fs.readFileSync('scripts/01_create_tables.sql', 'utf-8')
    const insertDataSql = fs.readFileSync('scripts/02_insert_data.sql', 'utf-8')
    const rlsPoliciesSql = fs.readFileSync('scripts/03_rls_policies.sql', 'utf-8')

    // Execute in sequence
    console.log('1. Creating tables...')
    const { error: createError } = await supabase.rpc('execute_sql', {
      sql: createTablesSql
    })
    if (createError) throw createError
    console.log('✓ Tables created')

    console.log('2. Inserting data...')
    const { error: insertError } = await supabase.rpc('execute_sql', {
      sql: insertDataSql
    })
    if (insertError) throw insertError
    console.log('✓ Data inserted')

    console.log('3. Applying RLS policies...')
    const { error: rlsError } = await supabase.rpc('execute_sql', {
      sql: rlsPoliciesSql
    })
    if (rlsError) throw rlsError
    console.log('✓ RLS policies applied')

    console.log('\n✅ Database setup complete!')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

runMigrations()
```

Run with:
```bash
node scripts/run-migrations.js
```

## Verification Steps

### Step 1: Check Tables Exist
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Expected output: categories, services, users, orders, favorites, promos, offers, cart_items

### Step 2: Check Row Counts
```sql
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'promos', COUNT(*) FROM promos
UNION ALL
SELECT 'offers', COUNT(*) FROM offers;
```

Expected output:
```
categories    4
services      24
users         7
promos        3
offers        3
```

### Step 3: Test RLS Policies
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Should show: ✓ for all tables
```

### Step 4: Sample Query Test
```sql
-- Get all active categories
SELECT * FROM categories WHERE active = true;

-- Get services in Vault category
SELECT s.* FROM services s
JOIN categories c ON s.category_id = c.id
WHERE c.name = 'The Vault' AND s.active = true;

-- Check test users
SELECT email, full_name, role FROM users;
```

## Troubleshooting

### Issue: "Relation already exists"
**Solution:** Drop existing tables first
```sql
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS promos CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
```

### Issue: Foreign key constraint violation
**Solution:** Ensure categories are created before services
- Run scripts in order: 01, 02, 03
- Don't run in parallel

### Issue: RLS policies not working
**Solution:** Check authentication
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables;

-- Test with authenticated user
SELECT * FROM users WHERE id = auth.uid();
```

### Issue: Data not appearing
**Solution:** Check active status
```sql
-- Services must be active and have valid category
SELECT id, name, active, category_id FROM services 
WHERE active = false OR category_id IS NULL;
```

## Success Indicators

✅ All three scripts executed without errors  
✅ 24 services visible in database  
✅ 7 users created (2 admin, 5 regular)  
✅ 4 categories with product counts  
✅ RLS policies enabled on all tables  
✅ Test login works with provided credentials  
✅ Admin can create/edit services  
✅ Regular users see only public data  

## Next Steps

1. ✅ Database tables created
2. ✅ Data inserted
3. ✅ RLS policies applied
4. ⏭️ Update frontend to use database (see DATABASE_SETUP.md)
5. ⏭️ Test real-time subscriptions
6. ⏭️ Deploy to production

## Quick Reference

| File | Purpose | Runtime |
|------|---------|---------|
| 01_create_tables.sql | Create all 8 tables | 1-2 sec |
| 02_insert_data.sql | Insert 38+ records | 1-2 sec |
| 03_rls_policies.sql | Configure security | 1-2 sec |

**Total Setup Time: 5-10 minutes**

---

**Ready to begin? Copy the first SQL file and paste it into Supabase SQL Editor now!**
