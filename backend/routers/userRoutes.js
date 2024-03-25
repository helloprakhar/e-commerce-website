const User = require("../models/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const users = await User.find();
  if (!users) {
    res.status(400).send("No users found :/");
  }

  res.send(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-passwordHash");

  if (!user) {
    res.status(400).send("No user found :/");
  }

  res.send(user);
});

router.post("/register", async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    return res.status(409).send("User with this email already exists");
  }

  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password),
    address: req.body.address,
    isAdmin: req.body.isAdmin === false,
  });

  user = await user.save();

  if (!user) {
    return res.status(400).send("User cannot be created");
  }

  res.send(user);
});
router.put("/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (currentUser.email !== req.body.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(409).send("User with this email already exists");
      }
    }
    let newPassword;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword, 
        address: req.body.address,
        isAdmin: req.body.isAdmin,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(400).send("No user found :/");
    }

    res.send(updatedUser);
  } catch (error) {
    console.error("Error occurred while updating user:", error);
    res.status(500).send("An error occurred while updating user.");
  }
});


router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("Invalid email");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.secret,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      user: user._id,
      isAdmin: user.isAdmin,
      token: token,
    });
  } else {
    return res.status(400).send("Invalid email or password :/");
  }
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      } else {
        return res.status(400).send("User not found :/");
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        error: err,
      });
    });
});

module.exports = router;
