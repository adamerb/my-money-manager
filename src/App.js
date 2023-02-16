import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [amount, setAmount] = useState('');
  const [datetime, setDatetime] = useState('')
  const [description, setDescription] = useState('')
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    getTransactions().then(setTransactions)
  }, []);

  const getTransactions = async () => {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  const addNewTransaction = (e) => {
    const url = process.env.REACT_APP_API_URL + '/transaction';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        amount,
        description,
        datetime
      })
    }).then(res => {
      res.json().then(
        setAmount(''),
        setDatetime(''),
        setDescription('')
      )
    })
  }

  const deleteTransaction = async (transaction) => {
    const url = process.env.REACT_APP_API_URL + `/transactions?id=${transaction._id}`;
    fetch(url, {
      method: 'DELETE'
    }).then(() => getTransactions()).then(response => setTransactions(response))
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.amount;
  }

  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1]
  balance = Number(balance.split('.')[0]).toLocaleString()

  return (
    <main>
      <h1 title='Balance'>${balance}<span>.{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input type='number'
            className='amount-input'
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder='Enter Amount'
            min={-999999999999999}
            max={999999999999999}
            autoComplete='off'
            required />
          <input type='date'
            onChange={e => setDatetime(e.target.value)}
            value={datetime}
            required />
        </div>
        <div className='description'>
          <input type='text'
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Description'
            maxLength={40}
            autoComplete='off'
            required
          />
        </div>
        <button type='submit' title='Add Transaction'>Add new transaction</button>
        <div className='entry-count' title='Number of Entries'>{`Number of Entries: ${transactions.length}`}</div>
      </form>

<div className='transactions'>
{transactions.length > 0 && transactions.map((transaction) => (
  <div className='transaction' key={transaction._id} id={transaction._id}>
    <div className='left'>
    <div className='description' >{transaction.description}</div>
    <div className='transaction-type'>{transaction.amount < 0 ? 'Expense' : 'Income'}</div>
    </div>
    <div className='right'>
    <div className={'price' + (transaction.amount < 0 ? ' red' : ' green')}>${transaction.amount.toLocaleString()}<button className='remove-button' onClick={(e) => { deleteTransaction(transaction, e) }}><i className="fa fa-trash-o" style={{ fontSize: '1rem' }}></i></button></div>
      <div className='datetime'> {transaction.datetime.split('-')[1]} / {transaction.datetime.split('-')[2].substring(0, 2)} / {transaction.datetime.split('-')[0]}</div>
    </div>
  </div>
))}
</div> 

    </main>
  );
}

export default App;


