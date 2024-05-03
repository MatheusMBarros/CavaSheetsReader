const { lerPlanilha } = require('../reader');

const variaveisConsts = () => {
  const spreadsheetId = "1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY";
  const sheetName = 'Variaveis';
  const range = 'B2:E23';
  return {
    spreadsheetId,
    sheetName,
    range,
  };
}

const aluminiumLost = async (req, res) => {
  const { spreadsheetId, sheetName, range } = variaveisConsts();

  try {
    const data = await lerPlanilha(spreadsheetId, sheetName, range);
    let perdaTotalPorMolde = {};

    data.forEach((item) => {
      const codigoMolde = item[0];
      const nomeMolde = item[1];
      if (codigoMolde !== "Cod") {
        const perdaTotal = Number(item[3].replace(",", ".")); 
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
