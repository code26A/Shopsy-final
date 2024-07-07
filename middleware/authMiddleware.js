import jwt from 'jsonwebtoken';
import pool from '../controller/authController.js';
import ck from 'ckey'
// Protected route token based
export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized Access: Token missing'
            });
        }
        const decoded = jwt.verify(token, ck.JWT_SECRET);
        req.user = decoded; // Store decoded user data in request object
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'Unauthorized Access: Invalid token'
        });
    }
};

// Admin access
export const isAdmin = async (req, res, next) => {
    try {
        const user=req.user;
        const {rows} = await pool.query("SELECT role FROM users WHERE id = $1", [user.user_id]);
        const userRole =rows[0].role; 

        if (userRole == 1) { 
           next()
        }else{
            return res.status(201).send({
                success: false,
                message: 'Unauthorized Access: Admin access required'
            });
        }
       
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Internal Server Error'
        });
    }
};
