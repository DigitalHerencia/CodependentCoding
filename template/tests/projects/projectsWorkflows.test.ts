// Why: Tests: schema rules, version-conflict handling and template rendering for projects.
import assert from "node:assert/strict";
import { test } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Prisma } from "@/generated/prisma/client";
import { updateTaskStatusTx } from "@/lib/db/transactions/projects-update-task-status.tx";
import { createTaskSchema } from "@/schemas/projectsSchemas";
import { ProjectsTemplate } from "@/components/templates/projectsTemplate";

const id = "00000000-0000-4000-8000-000000000001";

test("tasks reject arbitrary status-like priority and require a project", () => {
  assert.equal(
    createTaskSchema.safeParse({
      title: "Deliver",
      priority: "ACTIVE",
      projectId: id,
    }).success,
    false,
  );
  assert.equal(
    createTaskSchema.safeParse({ title: "Deliver", priority: "HIGH" }).success,
    false,
  );
  assert.equal(
    createTaskSchema.parse({ title: "Deliver", projectId: id }).priority,
    "MEDIUM",
  );
});

test("task updates reject stale versions instead of reporting success", async () => {
  const tx = {
    task: {
      updateMany: async ({
        where,
      }: {
        where: { organizationId: string; version: number };
      }) => {
        assert.equal(where.organizationId, "tenant-a");
        assert.equal(where.version, 4);
        return { count: 0 };
      },
      count: async () => 1,
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(
    updateTaskStatusTx(tx, {
      organizationId: "tenant-a",
      taskId: id,
      status: "DONE",
      expectedVersion: 4,
    }),
    { code: "CONFLICT" },
  );
});

test("task updates outside the organization are NOT_FOUND, not CONFLICT", async () => {
  const tx = {
    task: {
      updateMany: async () => ({ count: 0 }),
      count: async ({ where }: { where: { organizationId: string } }) => {
        assert.equal(where.organizationId, "tenant-a");
        return 0;
      },
    },
  } as unknown as Prisma.TransactionClient;
  await assert.rejects(
    updateTaskStatusTx(tx, {
      organizationId: "tenant-a",
      taskId: id,
      status: "DONE",
      expectedVersion: 4,
    }),
    { code: "NOT_FOUND" },
  );
});

test("project portfolio renders delivery progress and links to the actual project", () => {
  const html = renderToStaticMarkup(
    createElement(ProjectsTemplate, {
      projects: [
        {
          id,
          name: "Website delivery",
          description: "Acceptance brief",
          status: "ACTIVE",
          startsAt: null,
          dueAt: "2026-10-01",
          version: 1,
          taskCount: 5,
          openTaskCount: 2,
        },
      ],
      toolbar: null,
    }),
  );
  assert.match(html, /3 of 5 tasks closed/);
  assert.match(html, /<progress/);
  assert.match(html, new RegExp(`/projects/${id}/timeline`));
  assert.doesNotMatch(html, /<table/);
});
