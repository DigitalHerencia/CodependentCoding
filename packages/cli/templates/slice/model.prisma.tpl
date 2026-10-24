// Why: {{Module}} models: every table carries organizationId and is covered by prisma/rls/{{module}}.sql.
{{enums}}
model {{Entity}} {
  id             String @id @default(uuid()) @db.Uuid
  organizationId String @db.Uuid

{{prismaFields}}
  version Int @default(1)

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
{{prismaRelations}}

  createdAt DateTime @default(now()) @db.Timestamptz(6)
  updatedAt DateTime @updatedAt @db.Timestamptz(6)

  @@index([organizationId, updatedAt])
}
