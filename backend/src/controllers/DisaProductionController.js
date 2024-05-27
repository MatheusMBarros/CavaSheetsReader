const { MoldeInfos } = require('../consts/SheetsConsts');
const { lerPlanilha } = require('../reader');
const { piecesSplited } = require("../controllers/MoldProductionController");
const { filterData } = require('../DataFilter');

const getPiecesPerMold = async (req, res) => {
    try {
        const { dataInicial, dataFinal, operador, molde } = req.query;

        const piecesData = await piecesSplited();
        const moldData = await lerPlanilha(MoldeInfos.moldeSpreadsheetId, MoldeInfos.moldSheetName, MoldeInfos.moldRange);

        const moldMap = moldData.reduce((acc, mold) => {
            const moldId = mold[0];
            const piecesId = mold.slice(3, 7).filter(pieceId => pieceId);
            acc[moldId] = piecesId;
            return acc;
        }, {});

        const filteredData = await filterData(dataInicial, dataFinal, operador, molde);

        const piecesCount = filteredData.reduce((acc, item) => {
            const moldId = item[1];
            const producedMolds = Number(item[7]) || 0;

            if (moldMap[moldId]) {
                moldMap[moldId].forEach(pieceId => {
                    if (!acc[pieceId]) {
                        acc[pieceId] = 0;
                    }
                    acc[pieceId] += producedMolds;
                });
            }

            return acc;
        }, {});

        const result = Object.entries(piecesCount).map(([pieceId, totalProduction]) => ({
            pieceId,
            totalProduction
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getData = async (req, res) => {
    const { dataInicial, dataFinal, operador, molde } = req.query;

    try {
        const filteredData = await filterData(dataInicial, dataFinal, operador, molde);
        res.json(filteredData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMold = async (req, res) => {
    const { moldeSpreadsheetId, moldSheetName, moldRange } = MoldeInfos;
    try {
        const moldData = await lerPlanilha(moldeSpreadsheetId, moldSheetName, moldRange);
        res.json(moldData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getData, getMold, getPiecesPerMold };
