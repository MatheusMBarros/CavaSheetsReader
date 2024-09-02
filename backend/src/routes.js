const express = require('express');
const DisaProductionController = require("./controllers/DisaProductionController.js")
const MoldProductionController = require("./controllers/MoldProductionController.js");
const AluminumLostController = require('./controllers/AluminiumLostController.js');
const PieceProductionController = require("./controllers/PieceProductionController.js");
const CreatePalletController = require("./controllers/CreatePalletController.js");


const router = express.Router();
router.get('/disaData', DisaProductionController.getData)
router.get('/mold', DisaProductionController.getMold);
router.get('/pieces', MoldProductionController.piecesSplited);
router.get('/moldesProduzidos', MoldProductionController.moldProduction);
router.get('/pieceProduction', PieceProductionController.getPieceProduction); // Nova rota para produção por peça
router.get('/perdaAl' , AluminumLostController.aluminiumLost)

router.get('/loteInfo/:id', CreatePalletController.getLoteInfo)
router.get('/createPallet/:id', CreatePalletController.createPallet)
router.get('/production-by-lote', PieceProductionController.getPieceProductionByLote)



module.exports = router;

