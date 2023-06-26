const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {
  UserModel,
  UserModel2,
  blogs1,
  PublishedBlog,
  AuthSchemaModel,
  OTPModel,
} = require("./Users");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
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

app.post("/getUsers", (req, res) => {
  const password = req.body.password;
  if (password === process.env.CONTACT_RESPONSES_PWD) {
    UserModel2.find({}, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  } else {
    res.status(401).json({
      message: "Unauthorized user",
    });
  }
});

app.post("/getnewsletters", (req, res) => {
  const password = req.body.password;

  if (password === process.env.NEWSLETTER_PWD) {
    UserModel.find({}, (err, result) => {
      if (err) {
        res.json(err);
      } else {
        res.json(result);
      }
    });
  } else {
    res.status(401).json({
      message: "Unauthorized user",
    });
  }
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

app.get("/getblogs/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogs1.findById(blogId);
    res.json(blog);
  } catch (error) {
    console.log("Error fetching blog:", error);
    res.status(500).json({ error: "Error fetching blog" });
  }
});

app.post("/acceptedblogs", async (req, res) => {
  const { blogId } = req.body;

  try {
    const blog = await blogs1.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    blog.status = "published";
    await blog.save();
    const publishedBlog = new PublishedBlog(blog.toObject());
    await publishedBlog.save();

    console.log(blog.writeremail);
    console.log(blog.writernmae);
    const email = blog.writeremail;
    const subject = " Congratulations! Your blog Published";
    const text = `Dear ${blog.writernmae},\n\n We feel immense pleasure to tell you that our Content team has verified your blog and it has met our standards thus your blog has been published on our webiste https://ecellnits.org \n\n Keep writing blogs and inspiring the mass.\n\nE-Cell\nNational Institute of Technology, Silchar`;
    sendEmail(email, subject, text);

    res.status(200).json({ message: "Blog published successfully" });
  } catch (error) {
    console.log("Error storing published blog:", error);
    res.status(500).json({ error: "Error storing published blog" });
  }
});

app.get("/acceptedblogs", (req, res) => {
  PublishedBlog.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

app.post("/signup", async (req, res) => {
  const { name, email, password, bio, userimg } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password should not be less than 8 characters" });
    }

    const existingUser = await AuthSchemaModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new AuthSchemaModel({
      name,
      email,
      password: hashedPassword,
      bio,
      userimg,
    });

    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Failed to register user", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthSchemaModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.YOUR_SECRET_KEY,
      { expiresIn: "72h" }
    );
    // localStorage.setItem('token', token);
    res.status(200).json({ message: "Login successful", token });
    console.log("login successful");
  } catch (error) {
    console.error("Failed to log in", error);
    res.status(500).json({ error: "Failed to log in" });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.YOUR_SECRET_KEY
    );
    req.user = decoded;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    console.error("Failed to verify token", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/dashboard", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await AuthSchemaModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { name, email, bio, userimg, facebook, github, linkedin, instagram } =
      user;
    res
      .status(200)
      .json({
        name,
        email,
        bio,
        userimg,
        facebook,
        github,
        linkedin,
        instagram,
      });
  } catch (error) {
    console.error("Failed to retrieve user details", error);
    res.status(500).json({ error: "Failed to retrieve user details" });
  }
});

app.put("/editprofile", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const { name, bio, userimg, github, facebook, linkedin, instagram, newpwd,confirmnewpwd } =
    req.body;

  try {
    const user = await AuthSchemaModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (newpwd !== "" && newpwd.length < 8) {
      return res
        .status(400)
        .json({ error: "New Password should not be less than 8 characters" });
    }

      if (newpwd !== confirmnewpwd) {
        return res.status(400).json({ error: "Passwords must match" });
      }

    const newHashedPwd = await bcrypt.hash(newpwd, 10);

    if (newpwd) {
      user.password = newHashedPwd;
    }

    if (name) {
      user.name = name;
    }

    if (bio) {
      user.bio = bio;
    }

    if (userimg) {
      user.userimg = userimg;
    }

    if (github) {
      user.github = github;
    }

    if (facebook) {
      user.facebook = facebook;
    }

    if (linkedin) {
      user.linkedin = linkedin;
    }

    if (instagram) {
      user.instagram = instagram;
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Failed to update profile", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.get("/fetchprofile", verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await AuthSchemaModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { name, bio, userimg, email } = user;
    res.status(200).json({ name, bio, userimg, email });
  } catch (error) {
    console.error("Failed to retrieve profile", error);
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
});

app.get("/myprovisionalblogs", verifyToken, async (req, res) => {
  try {
    const writerEmail = req.user.email;

    console.log(writerEmail);
    const blogs = await blogs1.find({ writeremail: writerEmail });
    // const blogs = await PublishedBlog.find({ writeremail: writerEmail });
    res.status(200).json({ blogs });
    console.log(blogs);
  } catch (error) {
    console.error("Failed to retrieve blogs", error);
    res.status(500).json({ error: "Failed to retrieve blogs" });
  }
});

app.get("/mypublishedblogs", verifyToken, async (req, res) => {
  try {
    const writerEmail = req.user.email;

    console.log(writerEmail);
    const blogs = await PublishedBlog.find({ writeremail: writerEmail });
    res.status(200).json({ blogs });
    console.log(blogs);
  } catch (error) {
    console.error("Failed to retrieve blogs", error);
    res.status(500).json({ error: "Failed to retrieve blogs" });
  }
});

app.post("/api/blogs/:blogId/like", verifyToken, async (req, res) => {
  const userId = req.user.userId;
  const blogId = req.params.blogId;

  try {
    const blog = await PublishedBlog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (blog.likes.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already liked this blog" });
    }

    blog.likes.push(userId);
    blog.likesCount += 1;

    await blog.save();
    console.log("blog liked");

    res.status(200).json({ likes: blog.likesCount });
  } catch (error) {
    console.error("Failed to update like count", error);
    res.status(500).json({ error: "Failed to update like count" });
  }
});

app.get("/api/likedblogs", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId);

    const user = await AuthSchemaModel.findById(userId);
    // console.log(user)
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const likedBlogs = await PublishedBlog.find({ likes: userId }).exec();

    console.log(likedBlogs);
    res.status(200).json(likedBlogs);
  } catch (error) {
    console.error("Error fetching liked blogs:", error);
    res.status(500).json({ error: "Failed to fetch liked blogs" });
  }
});

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    sendEmail(
      email,
      "ECELL Signup OTP",
      `Your OTP for verifying your email id for creating account is: ${otp}`
    );

    await OTPModel.findOneAndUpdate({ email }, { otp }, { upsert: true });

    res.json({ success: true, otp: otp.toString() });
  } catch (error) {
    console.log("Error sending OTP:", error);
    res.status(500).json({ error: "An error occurred while sending the OTP" });
  }
});

app.post("/verify-otp", async (req, res) => {
  console.log("Request Body:", req.body);
  const enteredOTP = req.body.otp.toString().trim();
  const email = req.body.email;

  try {
    const otpData = await OTPModel.findOne({ email }).exec();

    console.log("Entered OTP:", enteredOTP);
    console.log("Stored OTP Data:", otpData.otp);
    // console.log(req.body.email)
    if (otpData) {
      const storedOTP = otpData.otp.toString().trim();
      if (enteredOTP === storedOTP) {
        res.status(200).json({ message: "OTP verified successfully" });
      } else {
        res.status(400).json({ message: "Wrong OTP. Please try again" });
      }
    } else {
      console.log("No OTP found for the provided email");
      res.status(400).json({ message: "No OTP found for the provided email" });
    }
  } catch (error) {
    // console.log("Error verifying OTP:", error);
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while verifying the OTP" });
  }
});

app.post("/api/comment/:id", verifyToken, async (req, res) => {
  try {
    const blogId = req.params.id;
    const { commentauthor, text, commentpic } = req.body;

    const blog = await PublishedBlog.findById(blogId);
    // const blog = await blogs1.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const newComment = {
      commentauthor,
      commentpic,
      text,
      createdAt: new Date(),
    };

    blog.comments.push(newComment);
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.log("Error adding comment:", error);
    res.status(500).json({ error: "Error adding comment" });
  }
});

app.get("/api/comment/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(postId);
    const comments = await PublishedBlog.find({ _id: postId });
    // const comments = await blogs1.find({ postId });
    console.log(comments);
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

app.put("/editblog/:blogId", verifyToken, async (req, res) => {
  const { blogId } = req.params;
  console.log(blogId);
  const {
    title,
    tag,
    intro,
    content,
    writernmae,
    writerintro,
    writerpic,
    timestamp,
    topicpic,
    writeremail,
  } = req.body;

  try {
    const blog = await blogs1.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    if (title) {
      blog.title = title;
    }

    if (tag) {
      blog.tag = tag;
    }

    if (intro) {
      blog.intro = intro;
    }

    if (content) {
      blog.content = content;
    }

    if (writernmae) {
      blog.writernmae = writernmae;
    }

    if (writerintro) {
      blog.writerintro = writerintro;
    }

    if (writerpic) {
      blog.writerpic = writerpic;
    }

    if (timestamp) {
      blog.timestamp = timestamp;
    }

    if (topicpic) {
      blog.topicpic = topicpic;
    }

    if (writeremail) {
      blog.writeremail = writeremail;
    }

    await blog.save();
    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    console.error("Failed to update Blog", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.get("/publicprofile/:writeremaill", async (req, res) => {
  try {
    const {writeremaill} = req.params;
    console.log(writeremaill)
    const user = await AuthSchemaModel.findOne({ email: writeremaill });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { name, email, bio, userimg, facebook, github, linkedin, instagram } =
      user;
    res.status(200).json({
      name,
      email,
      bio,
      userimg,
      facebook,
      github,
      linkedin,
      instagram,
    });
  } catch (error) {
    console.error("Failed to retrieve user details", error);
    res.status(500).json({ error: "Failed to retrieve user details" });
  }
});

const port = process.env.PORT || 2226;
app.listen(port, "0.0.0.0", () => {
  console.log(`server started at ${port}`);
});
