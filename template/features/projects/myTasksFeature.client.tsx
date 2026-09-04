"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MyTasksFeatureClient() {
  const [command, setCommand] = useState("");
  const [applied, setApplied] = useState("");

  return (
    <form
      aria-label="my-tasks command"
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        setApplied(command.trim());
      }}
    >
      <Input
        aria-label="Filter or command"
        className="h-8 w-48 rounded-none border-[#5b737a] bg-[#05070a] font-mono text-[0.65rem]"
        onChange={(event) => setCommand(event.target.value)}
        placeholder="Type a command or search…"
        value={command}
      />
      <Button
        className="h-8 rounded-none font-mono text-[0.62rem]"
        size="sm"
        type="submit"
      >
        Apply
      </Button>
      <span aria-live="polite" className="sr-only">
        {applied ? `Applied: ${applied}` : "No command applied"}
      </span>
    </form>
  );
}
