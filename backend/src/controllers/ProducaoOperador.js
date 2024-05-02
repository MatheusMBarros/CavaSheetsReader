
const { lerPlanilha } = require('../reader');
const {findMold} = require('./ProducaoMolde')

const spreadsheetId = "1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY";
const sheetName = 'Disa';
const range = 'A7:AT1000';

const filterData = async (dataInicial, dataFinal, operador, molde) => {
    try {
        const data = await lerPlanilha(spreadsheetId, sheetName, range);

        const filteredData = data.filter(item => {
            if (!item[0]) return false; // Verifica se a primeira célula está vazia ou null

            const [diaPlanilha, mesPlanilha, anoPlanilha] = item[0].split('/');
            const moldId = item[1];
            const dataItem = new Date(`${anoPlanilha}-${mesPlanilha.padStart(2, '0')}-${diaPlanilha.padStart(2, '0')}`);

            // Converte as datas de entrada para objetos Date
            const dataInicialObj = new Date(dataInicial);
            const dataFinalObj = new Date(dataFinal);

            return (!dataInicial || dataItem >= dataInicialObj) &&
                   (!dataFinal || dataItem <= dataFinalObj) &&
                   (!operador || item[4] === operador) &&
                   (!molde || moldId === molde);
        });

        return filteredData;
    } catch (error) {
        console.error('Erro ao filtrar os dados:', error);
        throw new Error("Erro ao filtrar os dados.");
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

module.exports = { getData };

