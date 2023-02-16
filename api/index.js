const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(cors())
app.use(express.json())
app.get('/api/test', (req, res) => {
    res.json('test')
});

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL);

// Add a transaction
app.post('/api/transaction', async (req, res) => {
    const { description, datetime, amount } = req.body;
    try {
        const transaction = await Transaction.create({ description, datetime, amount })
        res.json(transaction);
    } catch (e) {
        res.json({ error: e, message: 'Validation failed' })
    }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
    const transactions = await Transaction.find();
    res.json(transactions.sort((a,b) => {
        if (a.datetime < b.datetime){
          return -1
        }
        if (a.datetime > b.datetime) {
          return 1
        }
        return 0
      }))
});

// Delete one transaction
app.delete('/api/transactions', async (req, res) => {
    const transaction = req
    await Transaction.findByIdAndDelete(req.query.id);
    res.json('delete successful')
});


app.listen({ port: 4000 });