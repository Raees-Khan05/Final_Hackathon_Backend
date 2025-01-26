import mongoose from "mongoose";

const loanRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    amount: { type: Number, required: true },
    period: { type: Number, required: true },
    guarantors: [
        {
            name: { type: String, required: true },
            cnic: { type: String, required: true },
            email: { type: String, required: true },
            location: { type: String, required: true },
        }
    ],
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoanRequest', loanRequestSchema);
