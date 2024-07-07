import exp from "constants";
import pool from "./authController.js";
import fs, { stat } from "fs";
import ck from "ckey";
import slugify from "slugify";
import { message } from "antd";
import braintree from "braintree";
import { type } from "os";
import { timeStamp } from "console";
import dotenv from "dotenv";
dotenv.config();
//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, photo, quantity, shipping } =
      req.body;
    // Checking for missing fields
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !photo ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Generate slug from name
    const slug = slugify(name);

    // Inserting product into the database
    const product = await pool.query(
      "INSERT INTO product (name, slug, description, price, category, photo, quantity, shipping) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, slug, description, price, category, photo, quantity, shipping]
    );

    res.status(200).send({
      success: true,
      message: "Product Created Successfully",
      product: product.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};
export const getProductController = async (req, res) => {
  try {
    const query = `
            SELECT 
                p.*,
                c.id AS category_id,
                c.name AS category_name,
                c.slug AS category_slug
            FROM 
                product p
            LEFT JOIN 
                category c ON p.id = c.id`;

    const { rows } = await pool.query(query);
    const products = rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      price: row.price,
      category: {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug,
      },
      created_at: row.created_at,
      updated_at: row.updated_at,
      photo: row.photo,
      quantity: row.quantity,
      shipping: row.shipping,
    }));

    res.status(200).send({
      success: true,
      message: "Products Retrieved",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error getting products",
      error,
    });
  }
};

export const getsingleProductController = async (req, res) => {
  try {
    const { slug } = req.params;

    const { rows: productRows } = await pool.query(
      `SELECT * FROM product WHERE slug=$1`,
      [slug]
    );

    if (productRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Product Found",
      });
    }

    const product = productRows[0];

    // Fetch category for the product
    const { rows: categoryRows } = await pool.query(
      "SELECT * FROM category WHERE id=$1",
      [product.category]
    );

    if (categoryRows.length === 0) {
      return res.status(404).send({
        success: false,
        message: "Product category not found",
      });
    }

    const category = categoryRows[0];

    res.status(200).send({
      success: true,
      message: "Product Retrieved",
      product,
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error getting product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM product WHERE id=$1", [id]);
    res.status(200).send({
      success: true,
      message: "Deleted product",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error deleting product",
      error,
    });
  }
};
export const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, photo, quantity, shipping } =
      req.body;
    // Checking for missing fields
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !photo ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Generate slug from name
    const slug = slugify(name);

    // Inserting product into the database44
    const product = await pool.query(
      "UPDATE product SET name=$1, slug=$2, description=$3, price=$4, category=$5, photo=$6, quantity=$7, shipping=$8 WHERE id=$9",
      [name, slug, description, price, category, photo, quantity, shipping, id]
    );

    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product: product.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in update product",
    });
  }
};
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    // Assuming 'pool' is properly configured and imported
    const products = await pool.query(
      "SELECT * FROM product WHERE category = ANY($1) OR price >= $2 AND price <= $3",
      [checked, radio[0], radio[1]]
    );

    res.status(200).json({
      success: true,
      message: "Products filtered successfully",
      products: products.rows,
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({
      success: false,
      message: "Error filtering products",
      error: error.message,
    });
  }
};
//product count
export const getCountOfAllProducts = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT COUNT(*) FROM product");
    const total = parseInt(rows[0].count);
    res.status(200).send({
      success: true,
      message: "Count is obtained",
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};
//product list
export const productListController = async (req, res) => {
  try {
    const perPage = 3;
    const page = req.params.page ? parseInt(req.params.page) : 1; // Parse page number to integer

    const { rows } = await pool.query(
      "SELECT * FROM product ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [perPage, (page - 1) * perPage]
    );

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Error in product list controller:", error);
    res.status(500).json({
      success: false,
      message: "Error in product list controller",
      error: error.message, // Sending only error message to client for security
    });
  }
};
export const searchProductController = async (req, res) => {
  try {
    const { key } = req.params;
    const { rows } = await pool.query(
      "SELECT * FROM product WHERE name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%'",
      [key]
    );

    res.status(200).send({
      success: true,
      rows,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error in search product controller",
    });
  }
};
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const { rows } = await pool.query(
      `SELECT * FROM product WHERE category=$1 AND id!=$2`,
      [cid, pid]
    );

    res.status(200).send({
      success: true,
      message: "Found similar product",
      rows,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: false,
      message: "Error in realted Product controller",
      error,
    });
  }
};
export const productCategoryController = async (req, res) => {
  try {
    const category = await pool.query("SELECT * FROM category WHERE slug=$1", [
      req.params.slug,
    ]);
    const { rows } = await pool.query(
      "SELECT * FROM product WHERE category=$1",
      [category.rows[0].id]
    );
    res.status(200).send({
      success: true,
      category,
      rows,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error in Product Category Controller",
      error,
    });
  }
};
//payment gateway api
//token
// Token generation controller
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        res.status(500).send({ error: "Failed to generate client token" });
      } else {
        res.send({
          clientToken: response.clientToken,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Payment controller
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    // Calculate total amount from cart
    let total = cart.reduce((acc, item) => acc + parseFloat(item.price), 0);

    // Process payment with Braintree
    gateway.transaction.sale(
      {
        amount: total.toFixed(2), // Amount should be in string format with 2 decimal places
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async (err, result) => {
        if (result) {
          console.log(result);
          if (result.success) {
            // Transaction succeeded
            const orderInsertQuery = `
              INSERT INTO orders (products, payment, buyer_id)
              VALUES ($1, $2, $3)
              RETURNING id
            `;
            const orderValues = [
              JSON.stringify(cart),
              JSON.stringify(result),
              req.user.user_id,
            ];
            const orderResult = await pool.query(orderInsertQuery, orderValues);
            const orderId = orderResult.rows[0].id;

            res
              .status(200)
              .send({ ok: true, message: "Payment successful", orderId });
          } else {
            // Payment failed
            if (
              result.message.includes(
                "Cannot use a payment_method_nonce more than once."
              )
            ) {
              res
                .status(400)
                .send({ error: "Payment method nonce has already been used." });
            } else {
              res.status(400).send({ error: result.message });
            }
          }
        } else {
          // Handle error
          res.status(500).send({
            error: "An unexpected error occurred during payment processing.",
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
