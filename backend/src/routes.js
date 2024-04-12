const express = require('express');
const ProducaoOperador = require("./controllers/ProducaoOperador.js")
const ProducaoMolde = require("./controllers/ProducaoMolde.js")

const router = express.Router();

router.get('/producaoOperador', ProducaoOperador.getData);
router.get('/producaoMolde', ProducaoMolde.piecesSplited);




module.exports = router;
