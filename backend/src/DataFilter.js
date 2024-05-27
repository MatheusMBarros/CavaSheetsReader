const { DisaConsts } = require('./consts/SheetsConsts');
const { lerPlanilha } = require('./reader');

const filterData = async (dataInicial, dataFinal, operador, molde) => {
    try {
        const { spreadsheetId, sheetName, range } = DisaConsts;
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

module.exports = { filterData };
