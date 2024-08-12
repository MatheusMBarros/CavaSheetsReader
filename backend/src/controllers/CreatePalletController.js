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

module.exports = { getLoteInfo };
