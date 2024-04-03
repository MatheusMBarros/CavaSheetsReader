const { lerPlanilha } = require('../reader');

const corteCanalData = async (req, res) => {

    // ID da planilha
    const spreadsheetId ="1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY"

    // Nome da planilha
    const sheetName ='Canal';

    // Intervalo de células
    const range = 'A9:L1000';

    // Chame a função lerPlanilha com o spreadsheetId e o range
    const data = await lerPlanilha(spreadsheetId,sheetName, range);

    // Envie os dados como resposta
    res.end(JSON.stringify(data));
  
};



module.exports = { corteCanalData };
