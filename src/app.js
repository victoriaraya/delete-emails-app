const fetch = require('node-fetch');

const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
const REDIRECT_URI = 'YOUR_REDIRECT_URI';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

// Function to fetch and delete emails from a specific sender
async function fetchAndDeleteEmailsFromSender(senderEmail) {
    const apiUrl = 'https://mail.yahooapis.com/v1/neo/messages';

    const queryParams = new URLSearchParams({
        q: `from:"${senderEmail}"`,
        format: 'raw',
        read: 'true' // Marking messages as read to prevent fetching the same ones multiple times
    });

    const response = await fetch(`${apiUrl}?${queryParams}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const emails = await response.json();
        for (const email of emails) {
            await deleteEmail(email.id);
        }
        console.log(`Emails from ${senderEmail} deleted successfully.`);
    } else {
        console.error('Failed to fetch emails:', await response.text());
    }
}

// Function to delete a single email by ID
async function deleteEmail(emailId) {
    const apiUrl = `https://mail.yahooapis.com/v1/neo/messages/${emailId}`;

    const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        console.error(`Failed to delete email ${emailId}:`, await response.text());
    }
}

// Call the function with the sender's email address
fetchAndDeleteEmailsFromSender('sender@example.com');