// Import dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.post("/contact-us", async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;
    console.log(req.body);
    if (!name || !email) {
      return res.status(400).send("Missing required fields");
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).send("API key not defined");
    }

    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey = apiKey;

    const response =
      await new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
        sender: {
          email: "no-reply@marosconstruction.com",
          name: "Contact Maros Construction",
        }, // Use your own domain email
        to: [{ email: "info@maroscontruction.com" }],
        subject: "Contact form Maros Construction",
        htmlContent: `
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Contact message</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #dddddd;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333333;
              font-size: 24px;
              margin-bottom: 20px;
            }
            h3 {
              color: #555555;
              margin-bottom: 10px;
              font-size: 18px;
            }
            p {
              color: #777777;
              line-height: 1.5;
              font-size: 16px;
            }
            .footer {
              margin-top: 20px;
              font-size: 12px;
              color: #aaaaaa;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>New contact message</h1>
            <h3>Name: ${name}</h3>
            <h3>Email: ${email}</h3>
            <h3>Phone: ${phone}</h3>
            <h3>Subject: ${subject ? subject : ""}</h3>
            <p>${message}</p>
            <div class="footer">
              <p>This message was sent from the contact form of marosconstruction.com</p>
              <p>&copy; 2024 Maros Construction. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>`,
      });

    console.log(response);
    res.send("Message sent successfully.");
  } catch (error) {
    console.error(error);
    res.status(500).send("There was an error sending the message.");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
