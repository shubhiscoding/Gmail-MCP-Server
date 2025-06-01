import Imap from 'imap';
import { simpleParser } from 'mailparser';

import { config } from './config';

interface Email {
  attachments: EmailAttachment[];
  date: Date;
  from: string;
  html?: string;
  messageId: string;
  subject: string;
  text: string;
  to: string;
}

interface EmailAttachment {
  content: Buffer;
  contentType: string;
  filename: string;
}

/**
 * Fetches emails from Gmail using Imap
 * @param options Configuration options for email fetching
 * @returns Promise resolving to an array of emails
 */
export async function fetchEmails(options: {
  limit?: number;
  mailbox?: string;
  searchCriteria?: any[];
}): Promise<Email[]> {
  const { limit = 10, mailbox = 'INBOX', searchCriteria = ['ALL'] } = options;
  
  return new Promise((resolve, reject) => {
    const imap = createImapConnection();
    const emails: Email[] = [];

    imap.once('ready', () => {
      imap.openBox(mailbox, false, (err, box) => {
        if (err) {
          imap.end();
          return reject(err);
        }

        const fetch = imap.search(searchCriteria, (searchErr, results) => {
          if (searchErr) {
            imap.end();
            return reject(searchErr);
          }

          if (!results || results.length === 0) {
            imap.end();
            return resolve([]);
          }

          // Reverse the results to get latest emails first, then limit
          const limitedResults = results.reverse().slice(0, limit);

          const fetchOptions = {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID)', 'TEXT'],
            markSeen: false
          };

          const fetch = imap.fetch(limitedResults, fetchOptions);
          
          fetch.on('message', (msg, seqno) => {
            const email: Partial<Email> = {
              attachments: []
            };

            msg.on('body', (stream, info) => {
              let buffer = '';
              
              stream.on('data', (chunk) => {
                buffer += chunk.toString('utf8');
              });

              stream.once('end', () => {
                if (info.which.includes('HEADER')) {
                  const header = Imap.parseHeader(buffer);
                  email.messageId = header['message-id']?.[0] || '';
                  email.from = header.from?.[0] || '';
                  email.to = header.to?.[0] || '';
                  email.subject = header.subject?.[0] || '';
                  email.date = header.date ? new Date(header.date[0]) : new Date();
                } else {
                  // Parse the email body
                  simpleParser(buffer, (parseErr, parsed) => {
                    if (!parseErr && parsed) {
                      email.text = parsed.text || '';
                      email.html = parsed.html || undefined;
                      
                      // Handle attachments
                      if (parsed.attachments && parsed.attachments.length > 0) {
                        parsed.attachments.forEach(attachment => {
                          if (email.attachments && attachment.content) {
                            email.attachments.push({
                              content: attachment.content,
                              contentType: attachment.contentType || 'application/octet-stream',
                              filename: attachment.filename || 'unnamed'
                            });
                          }
                        });
                      }
                    }
                  });
                }
              });
            });

            msg.once('end', () => {
              if (email.messageId && email.from && email.subject) {
                emails.push(email as Email);
              }
            });
          });

          fetch.once('error', (fetchErr) => {
            imap.end();
            reject(fetchErr);
          });

          fetch.once('end', () => {
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.once('end', () => {
      resolve(emails);
    });

    // Connect to the Imap server
    imap.connect();
  });
}

// /**
//  * Fetches emails with a specific subject
//  * @param subject Subject to search for
//  * @param limit Maximum number of emails to fetch
//  * @returns Promise resolving to an array of emails with the specified subject
//  */
// export async function fetchEmailsBySubject(subject: string, limit = 10): Promise<Email[]> {
//   return fetchEmails({
//     limit,
//     mailbox: 'INBOX',
//     searchCriteria: ['SUBJECT', subject]
//   });
// }

// /**
//  * Fetches all emails from a specific sender
//  * @param sender Email address of the sender
//  * @param limit Maximum number of emails to fetch
//  * @returns Promise resolving to an array of emails from the specified sender
//  */
// export async function fetchEmailsFromSender(sender: string, limit = 10): Promise<Email[]> {
//   return fetchEmails({
//     limit,
//     mailbox: 'INBOX',
//     searchCriteria: ['FROM', sender]
//   });
// }

// /**
//  * Fetches all unread emails from the inbox
//  * @param limit Maximum number of emails to fetch
//  * @returns Promise resolving to an array of unread emails
//  */
// export async function fetchUnreadEmails(limit = 10): Promise<Email[]> {
//   return fetchEmails({
//     limit,
//     mailbox: 'INBOX',
//     searchCriteria: ['UNSEEN']
//   });
// }

/**
 * Creates an Imap connection to Gmail
 * @returns Imap connection instance
 */
function createImapConnection(): Imap {
  return new Imap({
    host: 'imap.gmail.com',
    password: config.gmail.password,
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false // Disable certificate verification
    },
    user: config.gmail.user
  });
}
