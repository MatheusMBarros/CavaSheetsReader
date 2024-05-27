const express = require('express');
const DisaProductionController = require("./controllers/DisaProductionController.js")
const MoldProductionController = require("./controllers/MoldProductionController.js");
const AuluminumLostController = require('./controllers/AuluminumLostController.js');
const PieceProductionController = require("./controllers/PieceProductionController.js");

const router = express.Router();
router.get('/disaData', DisaProductionController.getData)
router.get('/mold', DisaProductionController.getMold);
router.get('/pieces', MoldProductionController.piecesSplited);
router.get('/moldesProduzidos', MoldProductionController.moldProduction);
router.get('/pieceProduction', PieceProductionController.getPieceProduction); // Nova rota para produção por peça

router.get('/perdaAl' , AuluminumLostController.aluminiumLost)

module.exports = router;

