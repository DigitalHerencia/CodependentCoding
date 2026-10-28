#!/usr/bin/env node
// Why: process entry; mounts the terminal app the way Next mounts app/layout.
import { render } from "ink";

import { RootLayout } from "@/app/layout";
import { HomePage } from "@/app/page";

render(
  <RootLayout>
    <HomePage />
  </RootLayout>,
);
