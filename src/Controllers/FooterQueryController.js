const {
  UserModel,
  UserModel2,
  
} = require("../Models/UserModel");

const getUsers = (req, res) => {
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
};

const getNewsletters = (req, res) => {
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
};

const createUser = async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();
  const email = user.email;
  const subject = "Subscribed for Ecell NITS newsletter.🥳";
  const text = `Thank you for subscribing to the Ecell newsletter! Get ready to dive into a world of entrepreneurial inspiration, valuable resources, and exciting updates. We can't wait to share our knowledge and support your entrepreneurial journey. Stay tuned for our first newsletter, packed with valuable content to help you thrive.\n\nDon't forget to check your spam folder.\n\nBest regards,\n\nE-Cell,\nNational Institute of Technology, Silchar`;
  sendEmail(email, subject, text);
  res.json(user);
};

const sendQuery = async(req,res) => {
    const user = req.body;
    const newUser = new UserModel2(user);
    await newUser.save();
    const email = user.email;
    const subject = " Thank You for Contacting ECELL!";
    const text = `Dear ${user.name},\n\nThank you for reaching out to us through our website's "Contact Us" form.\nYou sent:\n> ${user.message}\n\nWe appreciate your interest in E-Cell, NITS. Our team is currently reviewing your message and will respond shortly.\n\nWhile we work on your inquiry, feel free to explore our website for more information. If you have any urgent questions or concerns, please don't hesitate to contact us directly at ecell@nits.ac.in.\n\nThank you for contacting us, and we look forward to assisting you!\n\nBest regards,\n\nE-Cell,\nNational Institute of Technology, Silchar`;
    sendEmail(email, subject, text);
    res.json(user);
}

module.exports = {
  getUsers,
  getNewsletters,
  createUser,sendQuery
};
