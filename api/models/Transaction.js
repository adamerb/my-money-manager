const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const TransactionSchema = new Schema({
    amount: {type: Number, required:true},
    description: {type: String, required:true},
    datetime: {type: Date, required:true},
});

const TransactionModel = model('Transaction', TransactionSchema)

module.exports = TransactionModel;


