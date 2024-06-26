const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Use o middleware cors para configurar o CORS
app.use(cors());
app.use(express.json());


// Configure as rotas usando o Express Router
const router = express.Router();

// Use o router como middleware
app.use(router);
router.use(routes)

app.listen(4000, () => {
  console.log('listening on port http://localhost:4000')
});
