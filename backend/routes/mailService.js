const mailjet = require('node-mailjet').apiConnect(
    '2b893100803d5a2410522a889f3d9f38', // Your public API key
    'd4a4d8e58bed5a7ed7eef74f61785c48'  // Your secret API key
  );
  
  const sendEmail = (toEmail, subject, textContent) => {
    const request = mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'raressimoiu@yahoo.de', // Replace with your validated email
            Name: 'SecurePass Team',
          },
          To: [
            {
              Email: toEmail,
              Name: 'New User',
            },
          ],
          Subject: subject,
          TextPart: textContent,
          HTMLPart: `<p>${textContent}</p>`,
        },
      ],
    });
  
    return request
      .then((result) => {
        console.log('Email sent successfully:', result.body);
      })
      .catch((err) => {
        console.error('Error sending email:', err.statusCode);
      });
  };
  
  module.exports = { sendEmail };  // Correctly export the sendEmail function
  