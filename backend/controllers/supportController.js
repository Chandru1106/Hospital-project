const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // In a real application, you would configure a transporter with SMTP credentials
        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // });

        // For now, we will log the email to the console and a file to simulate sending
        console.log('--- NEW SUPPORT REQUEST ---');
        console.log(`From: ${name} <${email}>`);
        console.log(`Message: ${message}`);
        console.log('---------------------------');

        // Simulate successful email sending
        // await transporter.sendMail({
        //     from: email,
        //     to: 'rickychandru6@gmail.com', // User's email
        //     subject: `Support Request from ${name}`,
        //     text: message
        // });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
};
