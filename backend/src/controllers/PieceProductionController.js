const { MoldeInfos } = require('../consts/SheetsConsts');
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
        return moldData.map(row => row.map(cell => typeof cell === 'string' ? parseFloat(cell.replace(',', '.')) : cell));
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
            const pieceId1 = mold[3]; // ID da peça 1
            const pieceId2 = mold[4]; // ID da peça 2
            const pieceId3 = mold[5]; // ID da peça 3
            const pieceId4 = mold[6]; // ID da peça 4
            const pieces = [pieceId1, pieceId2, pieceId3, pieceId4].filter(id => id !== '-');
            const validPieces = pieces.map(id => pieceMap[id]).filter(pieceName => pieceName); // Filtrar apenas os nomes de peças válidos
            acc[moldId] = { name: moldName, pieces: validPieces };
            return acc;
        }, {});

        // Calcular a produção por peça
        const pieceProductionMap = {};
        filteredData.forEach(data => {
            const moldId = data[1]; // Mudamos a posição para o código do molde
            const production = parseFloat(data[6].replace(/\./g, '')) - parseFloat(data[5].replace(/\./g, '')); // Calculamos a produção com base na diferença entre o contador final e inicial
            const moldInfo = moldMap[moldId]; // Informações do molde
            moldInfo.pieces.forEach(pieceName => {
                if (pieceProductionMap[pieceName]) {
                    pieceProductionMap[pieceName] += production; // Atualizamos a produção acumulada para a peça
                } else {
                    pieceProductionMap[pieceName] = production; // Inicializamos a produção para a peça
                }
            });
        });

        return pieceProductionMap;
    } catch (error) {
        console.error('Erro ao processar os dados de produção por peça:', error);
        throw new Error("Erro ao processar os dados de produção por peça.");
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

module.exports = { getPieceProduction };
