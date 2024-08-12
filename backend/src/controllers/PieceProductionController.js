const { MoldeInfos, DisaConsts } = require('../consts/SheetsConsts');
const { lerPlanilha } = require('../reader');
const { filterData } = require('../DataFilter');
const axios = require('axios');

const getPiecesData = async () => {
    try {
        const response = await axios.get('http://localhost:4000/pieces');
        return response.data;
    } catch (error) {
        throw new Error("Erro ao buscar dados das peças.");
    }
};

const getMoldData = async () => {
    try {
        const { moldeSpreadsheetId, moldSheetName, moldRange } = MoldeInfos;
        const moldData = await lerPlanilha(moldeSpreadsheetId, moldSheetName, moldRange);
        return moldData.map(row => row.map(cell => {
            if (typeof cell === 'string') {
                const parsed = parseFloat(cell.replace(',', '.'));
                return isNaN(parsed) ? cell : parsed;
            }
            return cell;
        }));
    } catch (error) {
        throw new Error("Erro ao buscar dados dos moldes.");
    }
};

const getPieceProductionData = async (dataInicial, dataFinal) => {
    try {
        // Buscar dados das peças
        const piecesData = await getPiecesData();

        // Buscar dados dos moldes
        const moldData = await getMoldData();

        // Filtrar dados
        const filteredData = await filterData(dataInicial, dataFinal, null, null);

        // Criar um mapa de peças com base no ID
        const pieceMap = piecesData.reduce((acc, piece) => {
            acc[piece[0]] = piece[1]; // Mapear de número para o identificador string da peça
            return acc;
        }, {});

        // Criar um mapa de moldes com base no ID
        const moldMap = moldData.reduce((acc, mold) => {
            const moldId = mold[0];
            const moldName = mold[1]; // Nome do molde

            const pieces = [];
            for (let i = 3; i < 43; i += 2) { // Ajustado para processar 20 posições ímpares
                if (mold[i] && mold[i] !== '-') {
                    pieces.push(mold[i]);
                }
            }

            const validPieces = pieces.map(id => pieceMap[id]).filter(pieceName => pieceName); // Filtrar apenas os nomes de peças válidos
            acc[moldId] = { name: moldName, pieces: validPieces };
            return acc;
        }, {});


        // Calcular a produção por peça
        const pieceProductionMap = {};
        filteredData.forEach(data => {
            const moldId = data[1]; // Mudamos a posição para o código do molde
            const initialCounter = parseFloat(data[5].replace(/\./g, '').replace(',', '.'));
            const finalCounter = parseFloat(data[6].replace(/\./g, '').replace(',', '.'));
            
            if (isNaN(initialCounter) || isNaN(finalCounter)) {
                console.warn(`Counters contain NaN values: initial=${data[5]}, final=${data[6]}`);
                return;
            }

            const production = finalCounter - initialCounter;
            const moldInfo = moldMap[moldId]; // Informações do molde

            if (moldInfo && moldInfo.pieces) {
                moldInfo.pieces.forEach(pieceName => {
                    if (pieceProductionMap[pieceName]) {
                        pieceProductionMap[pieceName] += production; // Atualizamos a produção acumulada para a peça
                    } else {
                        pieceProductionMap[pieceName] = production; // Inicializamos a produção para a peça
                    }
                });
            }
        });


        return pieceProductionMap;
    } catch (error) {
        console.error('Erro ao processar os dados de produção por peça:', error);
        throw new Error("Erro ao processar os dados de produção por peça.");
    }
};

const getProductionDataByLote = async (lote) => {
    try {
        const piecesData = await getPiecesData();
        const moldData = await getMoldData();

        const productionData = await lerPlanilha(DisaConsts.spreadsheetId, DisaConsts.sheetName, DisaConsts.range);
        
        const filteredData = productionData.filter((data) => data[8] === lote);

        if (filteredData.length === 0) {
            throw new Error(`Nenhum dado encontrado para o lote ${lote}.`);
        }

        const pieceMap = piecesData.reduce((acc, piece) => {
            acc[piece[0]] = piece[1];
            return acc;
        }, {});

        const moldMap = moldData.reduce((acc, mold) => {
            const moldId = mold[0];
            const moldName = mold[1];
            const pieces = [];
            for (let i = 3; i < 43; i += 2) {
                if (mold[i] && mold[i] !== '-') {
                    pieces.push(mold[i]);
                }
            }
            const validPieces = pieces.map(id => pieceMap[id]).filter(pieceName => pieceName);
            acc[moldId] = { name: moldName, pieces: validPieces };
            return acc;
        }, {});

        const pieceProductionMap = {};
        filteredData.forEach(data => {
            const moldId = data[1];
            const initialCounter = parseFloat(data[5].replace(/\./g, '').replace(',', '.'));
            const finalCounter = parseFloat(data[6].replace(/\./g, '').replace(',', '.'));

            if (isNaN(initialCounter) || isNaN(finalCounter)) {
                console.warn(`Counters contain NaN values: initial=${data[5]}, final=${data[6]}`);
                return;
            }

            const production = finalCounter - initialCounter;
            const moldInfo = moldMap[moldId];

            if (moldInfo && moldInfo.pieces) {
                moldInfo.pieces.forEach(pieceName => {
                    if (pieceProductionMap[pieceName]) {
                        pieceProductionMap[pieceName] += production;
                    } else {
                        pieceProductionMap[pieceName] = production;
                    }
                });
            }
        });

        return pieceProductionMap;
    } catch (error) {
        console.error('Erro ao processar os dados de produção por lote:', error);
        throw new Error("Erro ao processar os dados de produção por lote.");
    }
};

const getPieceProductionByLote = async (req, res) => {
    const { lote } = req.query;

    try {
        const data = await getProductionDataByLote(lote);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const getPieceProduction = async (req, res) => {
    const { dataInicial, dataFinal } = req.query;

    try {
        const data = await getPieceProductionData(dataInicial, dataFinal);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPieceProduction, getPieceProductionByLote };
