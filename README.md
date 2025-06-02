# Gmail MCP Server

A Model Context Protocol (MCP) server for Gmail integration, built with [FastMCP](https://github.com/punkpeye/fastmcp). This server provides AI assistants with the ability to interact with Gmail through a set of standardized tools.

## Overview

This project implements an MCP server that allows AI assistants to perform various Gmail operations including:

- Fetching emails from your inbox
- Searching emails by subject
- Searching emails from specific senders
- Retrieving unread emails
- Sending emails to recipients

The server uses IMAP for email retrieval and SMTP for sending emails, all secured through Gmail's authentication system.

## Setup

1. Clone the repository

```bash
git clone https://github.com/shubhiscoding/Gmail-MCP-Server
cd gmail-mcp
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
GMAIL_USER=your_gmail_address
GMAIL_APP_PASSWORD=your-app-password
```

To generate an App Password for your Gmail account:
1. Go to your Google Account > Security
2. Enable 2-Step Verification if not already enabled
3. Go to App passwords
4. Select "Mail" and your device
5. Click "Generate"

## Usage

### Starting the Server

Start the server in development mode:

```bash
npm run dev
```
### Configuration to run with Windsurf

Configure ```mcp_config.json``` to add gmail-mcp server:
```
{
  "mcpServers": {
    "gmail-mcp": {
      "command": "bash",
      "args": [
        "-c",
        "cd ~Your-Path-To-The-Repo/Gmail-MCP-Server && npm run start"
      ],
      "disabled": false
    }
  }
}
```

### Configuration to run with Claude desktop on Windows
```
{
  "mcpServers": {
    "gmail-mcp": {
      "command": "cmd",
      "args": ["/c", "cd /d ~Your-Path-To-The-Repo\\Gmail-MCP-Server && npm run start"]
    }
  }
}
```

## Video Demo

### Windsruf demo
https://github.com/user-attachments/assets/0c45ec24-be45-4271-b7d0-fc6cd58b850f

### Claude Desktop Demo


https://github.com/user-attachments/assets/ad1650e8-bcc4-481e-ab95-eaefd8de7472



## Available Tools

The server provides the following tools for AI assistants:

### 1. fetchEmails

Fetches emails from your inbox with optional filtering.

**Parameters:**
- `limit` (optional): Maximum number of emails to fetch (default: 10)
- `mailbox` (optional): Mailbox to fetch emails from (default: 'INBOX')
- `searchCriteria` (optional): IMAP search criteria (default: ['ALL'])

### 2. fetchEmailsBySubject

Fetches emails with a specific subject.

**Parameters:**
- `subject`: Subject to search for
- `limit` (optional): Maximum number of emails to fetch (default: 10)

### 3. fetchEmailsFromSender

Fetches emails from a specific sender.

**Parameters:**
- `sender`: Email address of the sender
- `limit` (optional): Maximum number of emails to fetch (default: 10)

### 4. fetchUnreadEmails

Fetches unread emails from your inbox.

**Parameters:**
- `limit` (optional): Maximum number of emails to fetch (default: 10)

### 5. sendEmails

Sends an email to a specified recipient.

**Parameters:**
- `to`: Email address of the recipient
- `subject`: Subject of the email
- `body`: Body of the email

## Security

This server uses environment variables to store sensitive information like your Gmail credentials. Never commit your `.env` file to version control.

## Technical Details

The project is built with:
- TypeScript for type safety
- Node.js IMAP and Nodemailer libraries for email operations
- FastMCP for MCP server implementation
- dotenv for environment variable management
