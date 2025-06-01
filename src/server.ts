import { FastMCP } from "fastmcp";
import { z } from "zod"; // Or any validation library that supports Standard Schema

import { fetchEmails } from "./gmail.js";
interface FetchEmailsArgs {
  limit?: number;
  mailbox?: string;
  searchCriteria?: any[];
}

const server = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});

server.addTool({
  description: "This tool Fetches emails from my inbox",
  execute: async (args: FetchEmailsArgs) => {
    return JSON.stringify((await fetchEmails(args)));
  },
  name: "fetchEmails",
  parameters: z.object({
    limit: z.number().optional().describe("Maximum number of emails to fetch, defaults to 10"),
    mailbox: z.string().optional().describe("Mailbox to fetch emails from, defaults to 'INBOX'"),
    searchCriteria: z.array(z.any()).optional().describe("IMAP search criteria, defaults to ['ALL']")
  }),
});

server.start({
  transportType: "stdio",
});