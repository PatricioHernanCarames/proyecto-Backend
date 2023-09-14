import mongoose from 'mongoose';
import fs from 'fs';

// Define a schema and model for the products
const ProductSchema = new mongoose.Schema({
    item : String,
    description : String,
    price : Number,
    thumbnail : String,
    stock : Number,
    code : String,
});

const Product = mongoose.model('Product', ProductSchema);

// Connect to MongoDB
mongoose.connect("mongodb+srv://PatricioHCarames:Back1234@backende-commerce.8rpdxkg.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    // Read JSON data from a file
    const rawData = fs.readFileSync('./products.json', 'utf-8');
    const jsonData = JSON.parse(rawData);

    // Insert data into the products collection
    try {
        await Product.insertMany(jsonData);
        console.log('Data populated successfully');
    } catch (error) {
        console.error('Error populating data:', error);
    } finally {
        mongoose.connection.close();
    }
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
