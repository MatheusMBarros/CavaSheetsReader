
const { lerPlanilha } = require('../reader');
const {findMold} = require('./ProducaoMolde')

const spreadsheetId = "1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY";
const sheetName = 'Disa';
const range = 'A7:AT1000';

const filterData = async (mes, ano, operador) => {
    try {
        const data = await lerPlanilha(spreadsheetId, sheetName, range);

        const filteredData = data.filter(item => {
            const [ diaPlanilha, mesPlanilha, anoPlanilha] = item[0].split('/');
            const moldId = item[1];
            return (!mes || mesPlanilha === mes) && (!ano || anoPlanilha === ano) && (!operador || item[4] === operador) && moldId;
        });

        return filteredData;
    } catch (error) {
        console.error('Erro ao filtrar os dados:', error);
        throw new Error("Erro ao filtrar os dados.");
    }
};



const getData = async (req, res) => {
    const { mes, ano, operador } = req.query;
    try {
        const filteredData = await filterData(mes, ano, operador);
            res.json(filteredData)    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getData };