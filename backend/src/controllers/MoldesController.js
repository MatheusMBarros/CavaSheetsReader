const { lerPlanilha } = require('../reader');

const moldesData = async (req, res) => {

    // ID da planilha
    const spreadsheetId ="1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY"

    // Nome da planilha
    const sheetName = 'cadastro moldes';

    // Intervalo de células
    const range = 'A3:O18';

    // Chame a função lerPlanilha com o spreadsheetId e o range
    const data = await lerPlanilha(spreadsheetId,sheetName, range);

  

    // Envie os dados como resposta
    res.end(JSON.stringify(data));
  
};


const findMold = async (id ) => {

  // ID da planilha
  const spreadsheetId ="1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY"

  // Nome da planilha
  const sheetName = 'cadastro moldes';

  // Intervalo de células
  const range = 'A9:L400';

  // Chame a função lerPlanilha com o spreadsheetId e o range
  const data = await lerPlanilha(spreadsheetId,sheetName, range);

  // Encontra o molde correspondente ao moldId
  const molde = data.find(item => item[0] === id);

  // Retorna o molde encontrado
  return molde;
}





module.exports = { moldesData,findMold };
