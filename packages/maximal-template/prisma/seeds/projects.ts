// Why: Seed: a demo project with tasks for the base organization; fixed IDs keep reseeding idempotent.
import type { SeedContext } from "@/prisma/seeds/base";

export const seedIds = {
  project: "00000000-0000-4000-8000-000000000040",
  projectMember: "00000000-0000-4000-8000-000000000041",
  milestone: "00000000-0000-4000-8000-000000000042",
  taskOne: "00000000-0000-4000-8000-000000000043",
  taskTwo: "00000000-0000-4000-8000-000000000044",
  taskDependency: "00000000-0000-4000-8000-000000000045",
} as const;

export async function seed({
  tx,
  organization,
  ownerMembership,
}: SeedContext): Promise<void> {
  const project = await tx.project.upsert({
    where: {
      id: seedIds.project,
    },
    update: {
      organizationId: organization.id,
      ownerMembershipId: ownerMembership.id,
      name: "Launch Maximal Template",
      description: "Reference project exercising the project recipe.",
      status: "ACTIVE",
      startsAt: new Date("2026-08-01T00:00:00.000Z"),
      dueAt: new Date("2026-09-15T00:00:00.000Z"),
    },
    create: {
      id: seedIds.project,
      organizationId: organization.id,
      ownerMembershipId: ownerMembership.id,
      name: "Launch Maximal Template",
      description: "Reference project exercising the project recipe.",
      status: "ACTIVE",
      startsAt: new Date("2026-08-01T00:00:00.000Z"),
      dueAt: new Date("2026-09-15T00:00:00.000Z"),
    },
  });

  await tx.projectMember.upsert({
    where: {
      id: seedIds.projectMember,
    },
    update: {
      organizationId: organization.id,
      projectId: project.id,
      membershipId: ownerMembership.id,
      role: "OWNER",
    },
    create: {
      id: seedIds.projectMember,
      organizationId: organization.id,
      projectId: project.id,
      membershipId: ownerMembership.id,
      role: "OWNER",
    },
  });

  const milestone = await tx.milestone.upsert({
    where: {
      id: seedIds.milestone,
    },
    update: {
      organizationId: organization.id,
      projectId: project.id,
      name: "Data layer ready",
      dueAt: new Date("2026-08-21T00:00:00.000Z"),
    },
    create: {
      id: seedIds.milestone,
      organizationId: organization.id,
      projectId: project.id,
      name: "Data layer ready",
      dueAt: new Date("2026-08-21T00:00:00.000Z"),
    },
  });

  const taskOne = await tx.task.upsert({
    where: {
      id: seedIds.taskOne,
    },
    update: {
      organizationId: organization.id,
      projectId: project.id,
      milestoneId: milestone.id,
      assigneeMembershipId: ownerMembership.id,
      title: "Finalize Prisma schema",
      status: "IN_PROGRESS",
      priority: "HIGH",
      position: 1,
    },
    create: {
      id: seedIds.taskOne,
      organizationId: organization.id,
      projectId: project.id,
      milestoneId: milestone.id,
      assigneeMembershipId: ownerMembership.id,
      title: "Finalize Prisma schema",
      status: "IN_PROGRESS",
      priority: "HIGH",
      position: 1,
    },
  });

  const taskTwo = await tx.task.upsert({
    where: {
      id: seedIds.taskTwo,
    },
    update: {
      organizationId: organization.id,
      projectId: project.id,
      milestoneId: milestone.id,
      assigneeMembershipId: ownerMembership.id,
      title: "Wire feature fetchers",
      status: "TODO",
      priority: "HIGH",
      position: 2,
    },
    create: {
      id: seedIds.taskTwo,
      organizationId: organization.id,
      projectId: project.id,
      milestoneId: milestone.id,
      assigneeMembershipId: ownerMembership.id,
      title: "Wire feature fetchers",
      status: "TODO",
      priority: "HIGH",
      position: 2,
    },
  });

  await tx.taskDependency.upsert({
    where: {
      id: seedIds.taskDependency,
    },
    update: {
      organizationId: organization.id,
      taskId: taskTwo.id,
      dependsOnTaskId: taskOne.id,
    },
    create: {
      id: seedIds.taskDependency,
      organizationId: organization.id,
      taskId: taskTwo.id,
      dependsOnTaskId: taskOne.id,
    },
  });
}
