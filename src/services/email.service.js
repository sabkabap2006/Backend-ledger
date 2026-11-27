require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Backend Ledger" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationEmail(name, email) {
    const subject = "Registration Confirmation";
    const text = `Dear ${name},\n\nThank you for registering with us.\n\nRegards,\nBackend Ledger`;
    const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Registration Confirmation</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering with us.</p>
      <p>Regards,<br>Backend Ledger</p>
    </div>
  `;

    await sendEmail(email, subject, text, html);
}

async function sendTransactionEmail(name, email, amount, type, balance) {
    const subject = "Transaction Success";
    const text = `Dear ${name},\n\nYour transaction was successful.\n\nRegards,\nBackend Ledger`;
    const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Transaction Success</h2>
      <p>Dear ${name},</p>
      <p>Your transaction was successful.</p>
      <p>Regards,<br>Backend Ledger</p>
    </div>
  `;

    await sendEmail(email, subject, text, html);
}

async function sendTransactionFailedEmail(name, email) {
    const subject = "Transaction Failed";
    const text = `Dear ${name},\n\nYour transaction failed.\n\nRegards,\nBackend Ledger`;
    const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>Transaction Failed</h2>
      <p>Dear ${name},</p>
      <p>Your transaction failed.</p>
      <p>Regards,<br>Backend Ledger</p>
    </div>
  `;

    await sendEmail(email, subject, text, html);
}

async function sendTransactionNotification(fromEmail, toEmail, amount, type) {
    if (fromEmail) {
        await sendTransactionEmail("Customer", fromEmail, amount, type);
    }
    if (toEmail) {
        await sendTransactionEmail("Customer", toEmail, amount, type);
    }
}

module.exports = {
    sendEmail,
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailedEmail,
    sendTransactionNotification
};
