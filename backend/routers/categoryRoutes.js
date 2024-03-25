const Category = require("../models/category");
const express = require("express");
const router = express.Router(); // This creates an instance of the Express router using express.Router().

router.get("/", async (req, res) => {
  const categories = await Category.find();

  if (!categories) {
    res.status(404).json({
      message: "No categories were found :/",
    });
  }

  res.status(200).send(categories);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404).json({
      message: "No category was found :/",
    });
  }

  res.status(200).send(category);
});

router.post("/", async (req, res) => {
  let category = new Category({
    name: req.body.name,
    categoryType: req.body.categoryType,
  });

  category = await category
    .save()
    .then((category) => {
      if (category) {
        res.status(201).send(category);
      } else {
        res.status(404).json({
          message: "No category provided",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.put("/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    categoryType: req.body.categoryType,
  });

  if (!category) {
    res.status(404).json({
      message: "No category was found :/",
    });
  }

  res.status(200).send(category);
});

router.delete("/:id", async (req, res) => {
  await Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          message: "Category deleted successfully",
        });
      } else {
        return res.status(404).json({
          message: "Category not found :/",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
});

module.exports = router; // This exports the router instance to be used in other parts of the application.
