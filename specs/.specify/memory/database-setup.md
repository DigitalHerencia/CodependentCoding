# Database Setup Documentation

## Environment Variables Required

For local development and migrations, you need both pooled and unpooled database connections:

```bash
# Runtime database connection (pooled for serverless)
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# Migration database connection (unpooled for schema changes)  
DATABASE_URL_UNPOOLED="postgresql://username:password@host:5432/database_name?pgbouncer=false"
```

## Migration Steps

1. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database** (development)

   ```bash
   # Uses DATABASE_URL_UNPOOLED for schema changes
   npx prisma db push
   ```

3. **Create Migration** (production)

   ```bash
   # Uses DATABASE_URL_UNPOOLED for schema changes
   npx prisma migrate dev --name init
   ```

## Testing Database Connection

Run the database connection test:

```bash
npx tsx scripts/test-db.ts
```

This script will:

- Test basic database connectivity
- Verify that User and Archive tables exist
- Perform simple count queries to validate schema

## Neon Database Configuration

When using Neon (recommended for this project):

1. Create a Neon project at <https://neon.tech>
2. Get your connection string from the dashboard
3. Use the connection string as-is for `DATABASE_URL`
4. Add `?pgbouncer=false` parameter for `DATABASE_URL_UNPOOLED`

## Vercel Deployment

Set the following environment variables in Vercel:

- `DATABASE_URL` - Pooled connection (runtime)
- `DATABASE_URL_UNPOOLED` - Direct connection (migrations)
- Other required variables per PRD.md

## Troubleshooting

- **Prisma Generate Fails**: Ensure @prisma/client is installed and network allows downloading binaries
- **Migration Fails**: Verify DATABASE_URL_UNPOOLED is set and accessible
- **Runtime Errors**: Check DATABASE_URL is set and database is accessible
