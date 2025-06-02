import { FastMCP } from "fastmcp";
import { z } from "zod"; // Or any validation library that supports Standard Schema

import { fetchEmails, fetchEmailsBySubject, fetchEmailsFromSender, fetchUnreadEmails, sendEmail } from "./gmail.js";
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
  description: "This tool Fetches emails from my inbox, returns an array of json, where each json is a email",
  execute: async (args: FetchEmailsArgs = {}) => {
    return JSON.stringify((await fetchEmails(args)));
  },
  name: "fetchEmails",
  parameters: z.object({
    limit: z.number().optional().describe("Maximum number of emails to fetch, defaults to 10"),
    mailbox: z.string().optional().describe("Mailbox to fetch emails from, defaults to 'INBOX'"),
    searchCriteria: z.array(z.any()).optional().describe("IMAP search criteria, defaults to ['ALL']")
  }),
  timeoutMs: 600000,
});


server.addTool({
  description: "This tool Fetches emails from my inbox based on subject, returns an array of json, where each json is a email",
  execute: async (args: {subject: string, limit?: number}) => {
    return JSON.stringify((await fetchEmailsBySubject(args.subject, args.limit)));
  },
  name: "fetchEmailsBySubject",
  parameters: z.object({
    limit: z.number().optional().describe("Maximum number of emails to fetch, defaults to 10"),
    subject: z.string().describe("Subject to search for")
  }),
  timeoutMs: 600000,
});

server.addTool({
  description: "This tool Fetches emails from my inbox based on sender, returns an array of json, where each json is a email",
  execute: async (args: {sender: string, limit?: number}) => {
    return JSON.stringify((await fetchEmailsFromSender(args.sender, args.limit)));
  },
  name: "fetchEmailsFromSender",
  parameters: z.object({
    limit: z.number().optional().describe("Maximum number of emails to fetch, defaults to 10"),
    sender: z.string().describe("Email address of the sender")
  }),
  timeoutMs: 600000,
});

server.addTool({
  description: "This tool Fetches unread emails from my inbox, returns an array of json, where each json is a email",
  execute: async (args: {limit?: number}) => {
    return JSON.stringify((await fetchUnreadEmails(args.limit)));
  },
  name: "fetchUnreadEmails",
  parameters: z.object({
    limit: z.number().optional().describe("Maximum number of emails to fetch, defaults to 10")
  }),
  timeoutMs: 600000,
});

server.addTool({
  description: "This tool sends an email to the specified recipient",
  execute: async (args: {to: string, subject: string, body: string}) => {
    return JSON.stringify((await sendEmail(args.to, args.subject, args.body)));
  },
  name: "sendEmails",
  parameters: z.object({
    to: z.string().describe("Email address of the recipient"),
    subject: z.string().describe("Subject of the email"),
    body: z.string().describe("Body of the email")
  }),
  timeoutMs: 600000,
});

server.start({
  transportType: "stdio",
});