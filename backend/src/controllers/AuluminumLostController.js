const { lerPlanilha } = require('../reader');
const {MoldeInfos} = require ("../consts/SheetsConsts")


const aluminiumLost = async (req, res) => {
  const { moldeSpreadsheetId, moldSheetName, moldRange } = MoldeInfos;

  try {
    const data = await lerPlanilha(moldeSpreadsheetId, moldSheetName, moldRange);
    let perdaTotalPorMolde = {};

    data.forEach((item) => {
      const codigoMolde = item[0];
      const nomeMolde = item[1];
      if (codigoMolde !== "Cod") {
        const perdaTotal = Number(item[43].replace(",", ".")); 
        perdaTotalPorMolde[nomeMolde] = perdaTotal;
      }
    });
    // Organiza os dados por ordem alfabética do nome do molde
    const perdaTotalPorMoldeOrdenada = Object.fromEntries(
      Object.entries(perdaTotalPorMolde).sort(([moldeA], [moldeB]) => moldeA.localeCompare(moldeB))
    );

    res.status(202).send(perdaTotalPorMoldeOrdenada);

  } catch (error) {
    console.error("Erro ao ler planilha:", error);
    res.status(500).send("Erro ao processar a requisição");
  }
}

module.exports = { aluminiumLost };
