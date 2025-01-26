import mongoose from "mongoose";
import Loan from "../models/Loan.js";
import User from "../models/User.js";

const requestLoan = async (req, res) => {
    try {
        const { userId, category, subcategory, amount, period, guarantors } = req.body;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Check if user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }

        // Create a new loan request
        const loan = new Loan({
            user: new mongoose.Types.ObjectId(userId), // Ensure `new` keyword is used
            category,
            subcategory,
            amount,
            period,
            guarantors,
        });

        // Save the loan request
        await loan.save();

        res.status(201).json({ message: "Loan request submitted successfully" });
    } catch (error) {
        console.error("Error creating loan request:", error.message);
        res.status(400).json({ error: error.message });
    }
};

export default requestLoan;
