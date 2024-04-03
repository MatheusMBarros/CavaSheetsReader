const DisaController = require("./controllers/DisaController.js")
const CorteCanalController = require("./controllers/CorteCanalController.js")
const MoldesController = require("./controllers/MoldesController.js")
const Reader = require("./reader")
const express = require('express');
const PerdaAlTotalController = require("./controllers/PerdaAlTotalController.js")
const OperadoresConrtoller = require("./controllers/OperadoresConrtoller.js")

const router = express.Router();

router.get('/disa', DisaController.getData);
router.get('/pecaMolde', DisaController.getPecasPorMolde);
router.get('/canal', CorteCanalController.corteCanalData);
router.get('/molde/:id', MoldesController.findMold);
router.get('/moldes', MoldesController.moldesData);
router.get('/operadores', OperadoresConrtoller.listOperators);
router.get('/perdaAl/:id', PerdaAlTotalController.perdaAlTotal);


module.exports = router;
