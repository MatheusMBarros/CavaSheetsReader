const { lerPlanilha } = require('../reader');
const { DisaConsts } = require("../consts/SheetsConsts");

const getLoteInfo = async (req, res) => {
  const loteId = req.params.id;
  const { spreadsheetId, sheetName, range } = DisaConsts;
  
  try {
    const loteData = await lerPlanilha(spreadsheetId, sheetName, range);
    
    // Filtra os dados baseados no palletId
    const filterData = loteData.filter((data) => {
      return data[8] === loteId;  // Supondo que palletId esteja na coluna 8
    });
    
    if (filterData.length === 0) {
      return res.status(404).json({ error: "Pallet not found" });
    }


    const loteInfo = {
      loteId: filterData[0][8],
      date: filterData[0][0],
      mold: filterData[0][1],
      moldQuantity: filterData[0][7],
      };

    res.json(loteInfo);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Erro ao buscar dados do pallet" });
  }
};

const cloneLoteInfo = async (loteId) => {
  const { spreadsheetId, sheetName, range } = DisaConsts;
  const loteData = await lerPlanilha(spreadsheetId, sheetName, range);

  const filterData = loteData.filter((data) => data[8] === 30); // Supondo que o loteId esteja na coluna 8

  try {
    if (filterData.length === 0) {
      throw new Error("Lote not found");
    }

    // Escreve os dados filtrados na planilha "TesteCorteCanal"
    await sheets.spreadsheets.values.update({
      spreadsheetId: CorteCanal.shpreadshetId,
      range: `${CorteCanal.sheetName}!A1`, // Define o range onde os dados serão copiados
      valueInputOption: 'RAW',
      resource: {
        values: [filterData[0]], // Clona apenas a linha correspondente ao loteId
      },
    });

    console.log(`Dados do lote ${loteId} clonados para a planilha: ${CorteCanal.shpreadshetId}`);
    return filterData[0]; // Retorna os dados clonados
  } catch (error) {
    console.error("Erro ao clonar dados do lote: ", error);
  }
};

const createPallet = async (loteId) => {
  try {
    const loteInfo = await cloneLoteInfo(30);
    console.log(loteInfo);
  } catch (error) {
    console.error("Erro ao criar pallet: ", error);
  }
};



module.exports = { getLoteInfo, createPallet };
