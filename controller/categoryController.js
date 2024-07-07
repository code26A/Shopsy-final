import pg from "pg";
import pool from "./authController.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const { rows } = await pool.query(
      "SELECT * FROM category WHERE name = $1",
      [name]
    );

    if (rows.length > 0) {
      return res.status(200).send({
        success: true,
        message: "Category Already Exists",
      });
    }

    const category = await pool.query(
      "INSERT INTO category (name,slug) VALUES ($1, $2)",
      [name, slugify(name)]
    );

    res.status(200).send({
      success: true,
      message: "new category created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in category",
    });
  }
};
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    console.log(id);
    const category = await pool.query(
      "UPDATE category SET name = $1, slug = $2 WHERE id = $3",
      [name, slugify(name), id]
    );
    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};
export const categoryControllers = async (req, res) => {
  try {
    const category = await pool.query("SELECT * FROM category");
    res.status(200).send({
      success: true,
      message: " All categories accessed",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all categories",
      error,
    });
  }
};
export const singleCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const cat = await pool.query("SELECT * FROM category WHERE slug=$1", [
      slug,
    ]);
    res.status(500).send({
      success: true,
      message: "single categories obtained",
      cat,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single categroy",
      error,
    });
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const { cid } = req.params;
    // Check if the category exists
    const categoryResult = await pool.query(
      "SELECT * FROM category WHERE id = $1",
      [cid]
    );
    if (categoryResult.rowCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    // Delete products in the category
    const deleteProductsResult = await pool.query(
      "DELETE FROM product WHERE category = $1",
      [cid]
    );

    // Delete the category
    const deleteCategoryResult = await pool.query(
      "DELETE FROM category WHERE id = $1",
      [cid]
    );
    console.log(`Deleted category: ${deleteCategoryResult.rowCount}`);

    res.status(200).send({
      success: true,
      message: "Deleted category",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
