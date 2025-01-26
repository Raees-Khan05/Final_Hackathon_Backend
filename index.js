import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import loanRoutes from './routes/loanRoutes.js'
import PDFDocument from 'pdfkit'

import fs from 'fs'



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users" , userRoutes)
app.use("/api/loans" , loanRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



app.get('/admin/requests', async (req, res) => {
    try {
        const requests = await LoanRequest.find().populate('user', 'name email');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve or reject a loan request
app.patch('/admin/requests/:id', async (req, res) => {
    const { status } = req.body; 
    try {
        const request = await LoanRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!request) {
            return res.status(404).json({ error: 'Loan request not found' });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/requests/:id/slip', async (req, res) => {
    try {
        const request = await LoanRequest.findById(req.params.id).populate('user', 'name email');
        if (!request) {
            return res.status(404).json({ error: 'Loan request not found' });
        }

        const doc = new PDFDocument();
        const filePath = `./slips/loan_request_${request._id}.pdf`;

        doc.pipe(fs.createWriteStream(filePath));

        doc.fontSize(20).text('Loan Request Slip', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${request.user.name}`);
        doc.text(`Email: ${request.user.email}`);
        doc.text(`Category: ${request.category}`);
        doc.text(`Subcategory: ${request.subcategory}`);
        doc.text(`Amount: ${request.amount}`);
        doc.text(`Period: ${request.period} years`);
        doc.text(`Status: ${request.status}`);
        doc.text('Guarantors:');
        request.guarantors.forEach((g, index) => {
            doc.text(`  ${index + 1}. ${g.name} (${g.cnic}, ${g.email}, ${g.location})`);
        });

        doc.end();
        res.status(200).json({ message: 'Slip generated', filePath });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default app;
