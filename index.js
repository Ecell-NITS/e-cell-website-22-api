const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { UserModel, UserModel2 } = require("./Users");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
app.use(bodyParser.json());
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODBSECRET);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PWD,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

app.post("/check-email", (req, res) => {
  const email = req.body.email;
  UserModel.findOne({ email }, (err, user) => {
    if (err) {
      console.log("Error checking email uniqueness:", err);
      res
        .status(500)
        .json({ error: "An error occurred while checking email uniqueness" });
    } else {
      const unique = !user;
      res.json({ unique });
    }
  });
});

app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();
  const email = user.email;
  const subject = "Subscribed for Ecell NITS newsletter.🥳";
  const text = `Thank you for subscribing to the Ecell newsletter! Get ready to dive into a world of entrepreneurial inspiration, valuable resources, and exciting updates. We can't wait to share our knowledge and support your entrepreneurial journey. Stay tuned for our first newsletter, packed with valuable content to help you thrive.\n\nDon't forget to check your spam folder.`;
  sendEmail(email, subject, text);
  res.json(user);
});

app.post("/sendquery", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel2(user);
  await newUser.save();
  const email = user.email;
  const subject = "Your Sent Us a Message";
  const text = `Hey there! You sent:\n\n\n\n>${user.message}\n\n\n\nWe'll get back to you as soon as we can! Hopefully with a useful answer.\n\n\n\nThanks,\nThe NITS ECELL Technical Team.`;
  sendEmail(email, subject, text);
  res.json(user);
});

// const port = process.env.PORT || 3001;
app.listen(3001, () => {
  console.log("server started on port 3001");
});
