const express = require('express');
const ProducaoOperador = require("./controllers/ProducaoOperador.js")
const ProducaoMolde = require("./controllers/ProducaoMolde.js");
const PerdaAlTotal = require('./controllers/PerdaAlTotal.js');

const router = express.Router();

router.get('/producaoOperador', ProducaoOperador.getData);
router.get('/producaoMolde', ProducaoMolde.piecesSplited);
router.get('/moldesProduzidos', ProducaoMolde.moldProduction);
router.get('/perdaAl' , PerdaAlTotal.aluminiumLost)

module.exports = router;

