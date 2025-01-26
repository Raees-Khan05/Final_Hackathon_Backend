import bcrypt from 'bcrypt'; // Make sure bcrypt is imported if you're using it
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import 'dotenv/config';  // Loads environment variables automatically




// Register User
const registerUser = async (req, res) => {
    const { name, email, cnic, password } = req.body;
    try {
        const user = new User({ name, email, cnic, password });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        console.log("User ID:", user._id);

        // Return both the token and userId in the response
        return res.json({
            token: token,
            userId: user._id // Ensure that this is present
            
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Correct way to export
export default { registerUser, loginUser };
