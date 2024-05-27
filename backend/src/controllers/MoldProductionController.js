const { lerPlanilha } = require('../reader');
const {DisaConsts, MoldeInfos, PecasInfo} = require ("../consts/SheetsConsts")

const filterDataByMonth = async (dataInicial, dataFinal) => {
  try {
    const { spreadsheetId, sheetName, range } = DisaConsts
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
               (!dataFinal || dataItem <= dataFinalObj) 
    });

    return filteredData;
} catch (error) {
    console.error('Erro ao filtrar os dados:', error);
    throw new Error("Erro ao filtrar os dados.");
}
};


//ja retorna separado por peça 
const moldProduction = async (req, res) => {
  const { dataInicial, dataFinal } = req.query;
  const data = await filterDataByMonth(dataInicial, dataFinal);

  // Objeto para armazenar os valores de moldes produzidos agrupados
  const moldProduction = {};

  data.forEach((item) => {
      const moldId = item[2];
      const quantity = Number(item[7].replace(".", "")); // Valor produzido do molde

      // Verifica se o moldId já está presente no objeto moldProduction
      if (moldProduction[moldId]) {
          moldProduction[moldId] += quantity;
      } else {
          moldProduction[moldId] = quantity;
      }
  });

  res.send(moldProduction);
};


//retorna o id da peça e o nome dela
const piecesSplited = async (req , res) => {
  const { piecesShpreadshetId, pieceSheetName, pieceRange } = PecasInfo
  const data = await lerPlanilha(piecesShpreadshetId, pieceSheetName, pieceRange);
  res.send(data)
};



module.exports = { piecesSplited,moldProduction };
