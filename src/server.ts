import { FastMCP } from "fastmcp";
import { z } from "zod"; // Or any validation library that supports Standard Schema

import { fetchEmails } from "./gmail";

const server = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});

server.addTool({
  description: "Fetch emails from my inbox",
  execute: async (args) => {
    return JSON.stringify((await fetchEmails(args))[0]);
  },
  name: "fetchEmails",
  parameters: z.object({}),
});

server.start({
  transportType: "stdio",
});