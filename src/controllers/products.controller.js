export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, category, stock, sort = "asc" } = req.query;
    const stockValue = stock == 0 ? undefined : parseInt(stock);
    if (!["asc", "desc"].includes(sort)) {
      return res.json({ status: "error", mesage: "orden no valido" });
    }
    const sortValue = sort === "asc" ? 1 : -1;

    let query = {};
    if (category && stockValue) {
      query = { category: category, stock: { $gte: stockValue } };
    } else {
      if (category || stockValue) {
        if (category) {
          query = { category: category };
        } else {
          query = { stock: { $gte: stockValue } };
        }
      }
    }
    // console.log("query: ", query);
    const result = await productManager.getPaginateProducts(query, {
      page,
      limit,
      sort: { price: sortValue },
      lean: true,
    });
    // console.log("result: ", result);
    const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
    res.json({
      status: "success",
      payload: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}`
        : null,
      nextLink: result.hasPrevPage
        ? `${baseUrl}?page=${result.prevPage}`
        : null,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const productById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);
    // console.log("product: ", product);
    res.status(200).json({ status: "success", result: product });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const body = req.body;
    body.status = Boolean(body.status);
    body.price = Number(body.price);
    body.stock = Number(body.stock);
    // console.log("body: ", body);
    const productAdded = await productManager.addProduct(body);
    res.json({
      status: "success",
      result: productAdded,
      message: "product added",
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.pid;
    const body = req.body;
    body.status = Boolean(body.status);
    body.price = Number(body.price);
    body.stock = Number(body.stock);
    // console.log("body: ", body);
    //actualizamos el método, pasándole el id y el body
    const productUpdated = await productManager.updateProduct(productId, body);
    res.json({
      status: "success",
      result: productUpdated,
      message: "product updated",
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.pid;

    const currentUser = req.user;

    const isAdmin = currentUser && currentUser.role === "admin";

    const productToDelete = await productManager.getProductById(productId);

    if (!productToDelete) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }

    if (!isAdmin && currentUser.email !== productToDelete.owner) {
      return res
        .status(403)
        .json({ status: "error", message: "Permission denied" });
    }

    const productDeleted = await productManager.deleteProduct(productId);

    res.json({ status: "success", result: productDeleted.message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const mockProducts = async () => {
  let products = [];
  for (let i = 1; i < 100; i++) {
    products.push({
      id: faker.datatype.uuid(),
      name: faker.commerce.productName(),
      price: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      category: faker.commerce.department(),
    });
  }
};
await product.insertMany(products);
return products;
