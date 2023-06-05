const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { UserModel, UserModel2, blogs1,PublishedBlog } = require("./Users");
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
    user: process.env.EMAIL_ECELL,
    pass: process.env.EMAIL_PWD_ECELL,
  },
});

const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_ECELL,
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

app.get("/getUsers", (req, res) => {
  UserModel2.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get("/getnewsletters", (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get("/", (req, res) => {
  res.send("<p>Welcome to ecell website api.</p>");
});


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
  const text = `Thank you for subscribing to the Ecell newsletter! Get ready to dive into a world of entrepreneurial inspiration, valuable resources, and exciting updates. We can't wait to share our knowledge and support your entrepreneurial journey. Stay tuned for our first newsletter, packed with valuable content to help you thrive.\n\nDon't forget to check your spam folder.\n\nBest regards,\n\nE-Cell,\nNational Institute of Technology, Silchar`;
  sendEmail(email, subject, text);
  res.json(user);
});

app.post("/sendquery", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel2(user);
  await newUser.save();
  const email = user.email;
  const subject = " Thank You for Contacting ECELL!";
  const text = `Dear ${user.name},\n\nThank you for reaching out to us through our website's "Contact Us" form.\nYou sent:\n> ${user.message}\n\nWe appreciate your interest in E-Cell, NITS. Our team is currently reviewing your message and will respond shortly.\n\nWhile we work on your inquiry, feel free to explore our website for more information. If you have any urgent questions or concerns, please don't hesitate to contact us directly at ecell@nits.ac.in.\n\nThank you for contacting us, and we look forward to assisting you!\n\nBest regards,\n\nE-Cell,\nNational Institute of Technology, Silchar`;
  sendEmail(email, subject, text);
  res.json(user);
});

app.post("/createblog", async (req, res) => {
  const user = req.body;
  const newUser = new blogs1(user);
  await newUser.save();
  res.json(user);
});

app.get("/getblogs", (req, res) => {
  blogs1.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.get('/getblogs/:id', async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogs1.findById(blogId);
    res.json(blog);
  } catch (error) {
    console.log('Error fetching blog:', error);
    res.status(500).json({ error: 'Error fetching blog' });
  }
});

app.post("/acceptedblogs", async (req, res) => {
  const { blogId } = req.body

  try {
    const blog = await blogs1.findById(blogId)
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    blog.status = "published";
    await blog.save();
    const publishedBlog = new PublishedBlog(blog.toObject());
    await publishedBlog.save();

    console.log(blog.writeremail)
    console.log(blog.writernmae)
    const email = blog.writeremail;
    const subject = " Congratulations! Your blog Published";
    const text = `Dear ${blog.writernmae},\n\n We feel immense pleasure to tell you that our content has verified your blog and it has met our standards so your blog has been published on our webiste https://ecellnits.org \n\n Keep writing blogs and inspiring the mass.`;
    sendEmail(email, subject, text);

    res.status(200).json({ message: "Blog published successfully" });
  } catch (error) {
    console.log("Error storing published blog:", error);
    res.status(500).json({ error: "Error storing published blog" });
  }
})

app.get("/acceptedblogs", (req, res) => {
  PublishedBlog.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

const port = process.env.PORT || 2226;
app.listen(port, "0.0.0.0", () => {
  console.log("server started.");
});
