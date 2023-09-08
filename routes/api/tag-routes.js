const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
Tag.findAll({
  attributes: ["id", "tag_name"],
  include: [
    {
      model: Product,
      attributes: ["id", "product_name", "price", "stock", "category_id"],
      through: ProductTag,
      as: "products",
    },
  ],
})
  .then((dbTagData) => res.json(dbTagData))
  .catch((err) => {
    res.status(500).json(err);
  });
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const singleTagData = await Tag.findByPk(req.params.ic, {
      include: [{ model: Product, through: ProductTag }]
    });
    if (!singleTagData) {
      res.status(404).json({ message: 'No tag was found with that id '});
      return;
    }
    res.status(200).json(singleTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  await Tag.create(req.body)
  .then((tag) => {
    res.status(200).json(tag);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  await Tag.update(req.body)
  .then((tag) => {
    res.status(200).json(tag);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
try {
  const singleTagData = await Tag.destroy({
    where: {
      id: req.params.id
    }
  });
  if (!singleTagData) {
    res.status(404).json({ message: 'No tag found with that id' });
    return;
  }
  res.status(200).json(singleTagData);
} catch (err) {
  res.status(500).json(err);
}
});

module.exports = router;