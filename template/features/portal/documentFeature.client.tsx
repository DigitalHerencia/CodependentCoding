"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DocumentFeatureClient() {
  const [command, setCommand] = useState("");
  const [applied, setApplied] = useState("");

  return (
    <form
      aria-label="portal documents documentId command"
      className="flex w-full flex-wrap items-center gap-2 sm:w-auto"
      onSubmit={(event) => {
        event.preventDefault();
        setApplied(command.trim());
      }}
    >
      <Input
        aria-label="Filter or command"
        className="w-full min-w-0 sm:w-48"
        onChange={(event) => setCommand(event.target.value)}
        placeholder="Type a command or search…"
        value={command}
      />
      <Button className="shrink-0" size="sm" type="submit">
        Apply
      </Button>
      <span aria-live="polite" className="sr-only">
        {applied ? `Applied: ${applied}` : "No command applied"}
      </span>
    </form>
  );
}
