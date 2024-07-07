import pg from "pg";
import { comparePassword, hashpassword } from "../helper/authHelper.js";
import jwt from "jsonwebtoken"; // Updated import statement
import ck from "ckey";
import { message } from "antd";

const dbConfig = {
  user: ck.DB_USER,
  password: ck.DB_PASSWORD,
  host: ck.DB_HOST,
  port: ck.DB_PORT,
  database: ck.DB_DATABASE,
};

const pool = new pg.Pool(dbConfig);

async function findUserByEmail(email) {
  try {
    const client = await pool.connect();
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await client.query(query, [email]);
    const userExists = result.rows.length;
    client.release();
    return userExists;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
}

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validation
    if (!name || !email || !password || !phone || !address || !answer) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await findUserByEmail(email);
    if (userExists) {
      return res
        .status(200)
        .send({ success: false, message: "User already exists." });
    }

    // Hash password
    const hashedPassword = await hashpassword(password);

    // Save new user to database
    const addUserQuery = `
            INSERT INTO users (name, email, password, phone, address, answer)
            VALUES ($1, $2, $3, $4, $5,$6)
        `;
    await pool.query(addUserQuery, [
      name,
      email,
      hashedPassword,
      phone,
      address,
      answer,
    ]);

    res.status(201).json({
      success: true,
      message: "User Successfully Created!",
      user: { name, email, phone, address }, // Send registered user's details in response
    });
  } catch (error) {
    console.error("Error in registering:", error);
    res.status(500).json({
      success: false,
      message: "Error in registering",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .send({ success: false, message: "Invalid email or password" });

    // Check if user exists
    const userExists = await findUserByEmail(email);
    if (!userExists) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Retrieve password from database
    const passQuery = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(passQuery, [email]);
    const dbPassword = rows[0].password;
    const user_id = rows[0].id;
    const user_name = rows[0].name;
    const user_email = rows[0].email;
    const user_phone = rows[0].phone;
    const user_address = rows[0].address;
    const user_role = rows[0].role;

    // Compare passwords
    const match = await comparePassword(password, dbPassword);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Create token and send it to the client
    const token = jwt.sign({ user_id }, ck.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).send({
      success: true,
      message: "Login Successful!",
      user: {
        id: user_id,
        name: user_name,
        email: user_email,
        phone: user_phone,
        address: user_address,
        role: user_role,
      },
      token,
    });
    req.user = user_id;
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ success: false, message: "Error in login", error });
  }
};
export const testController = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "test complete",
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !answer || !newPassword) {
      res.status(404).send({
        message: "Please fill all input fields",
      });
    }
    //check
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND answer=$2",
      [email, answer]
    );
    const user = rows[0];
    //validation
    if (!user) {
      return res.status(404).SEND({
        message: "User not found or incorrect answer",
      });
    }
    //hash password and update database
    const hashed = await hashpassword(newPassword);
    await pool.query("UPDATE users SET password=$1 WHERE id=$2", [
      hashed,
      rows[0].id,
    ]);
    res.status(200).send({
      success: true,
      message: "Password Successfully  Changed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (password && password.length < 6) {
      return res.JSON({ error: "Passwprd is required and 6 character long" });
    }
    const hashedPassword = password ? await hashpassword(password) : undefined;
    await pool.query(
      "UPDATE users SET name = $1 , phone=$2 , address =$3, password=$4 WHERE email=$5",
      [name, phone, address, hashedPassword, email]
    );
    const { rows } = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const updatedUser = rows[0];
    res.status(200).send({
      success: true,
      message: "User profile updated",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in update product controller",
    });
  }
};
export const getOrdersController = async (req, res) => {
  try {
    const orders = await pool.query("SELECT * FROM orders WHERE buyer_id=$1", [
      req.user.user_id,
    ]);
    const buyer = await pool.query("SELECT * FROM users WHERE id=$1", [
      req.user.user_id,
    ]);
    const products = await pool.query(
      "SELECT products FROM orders WHERE buyer_id=$1",
      [req.user.user_id]
    );
    res.status(200).send({ success: true, orders, buyer, products });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};
export const getALLOrdersController = async (req, res) => {
  try {
    const orders = await pool.query("SELECT * FROM orders ORDER BY created_at");
    const buyer = await pool.query("SELECT * FROM users WHERE id=$1", [
      req.user.user_id,
    ]);
    const products = await pool.query(
      "SELECT products FROM orders WHERE buyer_id=$1",
      [req.user.user_id]
    );
    res.status(200).send({ success: true, orders, buyer, products });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const { status } = req.body;
    const orders = await pool.query("UPDATE orders SET status=$1 WHERE id=$2", [
      status,
      orderId,
    ]);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in order status controller",
      error,
    });
  }
};
export default pool;
