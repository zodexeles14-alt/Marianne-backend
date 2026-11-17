const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const donationRoutes = require('./donationRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: 'https://zodexeles14-alt.github.io'
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', donationRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Marianne Foundation ObiPay Backend is running successfully!' });
});

app.listen(PORT, () => {
  console.log(`Marianne Foundation backend running on port ${PORT}`);
});

