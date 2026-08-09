# Transaction helper

A transaction helper receives `Prisma.TransactionClient` and owns the database changes that commit or roll back together. It enforces database-adjacent invariants and contains no hidden provider or network work.
