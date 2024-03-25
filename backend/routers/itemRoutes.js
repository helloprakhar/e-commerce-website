const express = require("express");
const router = express.Router(); // This creates an instance of the Express router using express.Router().
const Item = require("../models/items");
const uploads = require("../management/multer");
const { default: mongoose } = require("mongoose");

router.get("/", async (req, res) => {
  const { newArrival } = req.query; // optional query parameter to filter the items based on whether they are new arrivals or not.

  let items;
  if (newArrival === "true") {
    // Retrieve only new arrival items
    items = await Item.find({ newArrival: true }).populate("category");
  } else {
    // Retrieve all items
    items = await Item.find().populate("category");
  }

  if (!items) {
    return res.status(404).json({
      message: "No items found :/",
    });
  }

  res.status(200).json(items);
});

router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id).populate("category");

  if (!item) {
    return res.status(404).json({
      message: "No Item was found :/",
    });
  }

  res.status(200).send(item);
});

router.post("/", uploads.single("image"), async (req, res) => {
  // uploads.single('image') as middleware to handle the image file upload.
  const { name, description, price, category, newArrival } = req.body;

  const file = req.file;

  if (!file) {
    return res.status(400).send("No image in request :/");
  }

  const fileName = req.file.filename;
  const path = `${req.protocol}://${req.get("host")}/public/images/`;

  let item = new Item({
    // Item Object
    name: name,
    description: description,
    price: price,
    image: `${path}${fileName}`,
    category: category,
    newArrival: newArrival,
  });

  try {
    item = await item.save();
    res.status(201).json("Created successfully!");
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Creation failed :/",
    });
  }
});

router.put("/:id", uploads.single("image"), async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Id");
  }

  const { name, description, price, category, newArrival } = req.body;

  const item = await Item.findById(req.params.id);

  if (!item) {
    return res.status(400).send("Invalid item Id");
  }

  const file = req.file;
  let image;

  if (file) {
    const fileName = file.filename;
    const path = `${req.protocol}://${req.get("host")}/public/images/`;
    image = `${path}${fileName}`;
  } else {
    image = item.image;
  }

  const modifiedItem = await Item.findByIdAndUpdate(
    req.params.id,
    {
      name: name,
      description: description,
      price: price,
      image: image,
      category: category,
      newArrival: newArrival,
    },
    { new: true } 
  );

  if (!modifiedItem) {
    return res.status(500).send("The item cannot be updated");
  }

  res.send(modifiedItem);
});

router.delete("/:id", async (req, res) => {
  await Item.findByIdAndRemove(req.params.id)
    .then((item) => {
      if (item) {
        return res.status(200).send(item);
      } else {
        return res.status(400).send("Item not found :/");
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





