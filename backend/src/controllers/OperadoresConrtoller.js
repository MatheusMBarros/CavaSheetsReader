const { lerPlanilha } = require('../reader');



const listOperators = async (req , res ) => {
  const { id } = req.params

  // ID da planilha
  const spreadsheetId ="1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY"

  // Nome da planilha
  const sheetName = 'cadastro operador';

  // Intervalo de células
  const range = 'A5:B18';

  // Chame a função lerPlanilha com o spreadsheetId e o range
  const data = await lerPlanilha(spreadsheetId,sheetName, range);
  
  res.end(JSON.stringify(data));
 
}


module.exports = { listOperators };
