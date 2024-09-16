/*const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://condeferriarthur:<1234>@arthur.ewjyj.mongodb.net/?retryWrites=true&w=majority&appName=arthur";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

*/

// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Conectar ao MongoDB Atlas
const mongoURI = 'mongodb+srv://condeferriarthur:1234@arthur.ewjyj.mongodb.net/?retryWrites=true&w=majority&appName=arthur';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Definir esquema e modelo para o histórico de conversas e logins
const conversationSchema = new mongoose.Schema({
  userId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const loginSchema = new mongoose.Schema({
  userId: String,
  loginTime: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
const Login = mongoose.model('Login', loginSchema);

// Endpoints

// Salvar conversa
app.post('/api/conversations', async (req, res) => {
  const { userId, message } = req.body;
  const newConversation = new Conversation({ userId, message });
  try {
    await newConversation.save();
    res.status(201).send('Conversation saved');
  } catch (error) {
    res.status(500).send('Error saving conversation');
  }
});

// Salvar login
app.post('/api/logins', async (req, res) => {
  const { userId } = req.body;
  const newLogin = new Login({ userId });
  try {
    await newLogin.save();
    res.status(201).send('Login saved');
  } catch (error) {
    res.status(500).send('Error saving login');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

