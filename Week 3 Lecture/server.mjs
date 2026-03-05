import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const products = [
    {name: 'Cornflakes', manufacturer: 'Organic Products Ltd', price: 2.49 },
    {name: 'Oats', manufacturer: 'Healthy Foods Ltd', price: 2.49 },
    {name: 'Wheat Biscuits', manufacturer: 'Cereal Factory', price: 2.49 }
]

app.get('/api/products', (req, res) => {
    res.json(products)
});

app.post('/api/products', (req, res) => {
    const { name, manufacturer, price } = req.body;
    if(!name || !manufacturer || !price) {
        return res.status(400).json({error: 'Please fill all fields'});
    }
    products.push({ name, manufacturer, price });
    res.json({message: 'Product added successfully'})
});

app.listen(3000, () => {
console.log('Server is running on http://localhost:3000')
})
