const { lerPlanilha } = require('../reader');

const perdaAlTotal = async (req, res) => {
  const { id } = req.params;

  const moldeConsts = () => {
    const spreadsheetId = "1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY";
    const sheetName = 'cadastro moldes';
    const range = 'A3:O18';
    return {
      spreadsheetId,
      sheetName,
      range,
    };
  }

  // Define the perdaAlMolde and perdaAlPeca functions using the constants
  const perdaAlPeca = async () => {
    const { spreadsheetId, sheetName, range } = moldeConsts();
    const data = await lerPlanilha(spreadsheetId, sheetName, range);
    const perdaAlPeca = data.filter(item => item[0] === id);
    let pesoBruto = perdaAlPeca[0][11];
    pesoBruto = Number(pesoBruto.replace(",", "."));
    let pesoPronto = perdaAlPeca[0][12];
    pesoPronto = Number(pesoPronto.replace(",", "."));
    const perdaAlMolde = pesoBruto - pesoPronto;
    return Number(perdaAlMolde.toFixed(3) );
  }

  const perdaAlMolde = async () => {
    const { spreadsheetId, sheetName, range } = moldeConsts();
    const data = await lerPlanilha(spreadsheetId, sheetName, range);
    let pesoMolde = data.filter(item => item[0] === id);
    let perdaMolde = pesoMolde[0][13];
    perdaMolde = Number(perdaMolde.replace(",", "."));
    return Number(perdaMolde);
  };

  // Call the perdaAlMolde and perdaAlPeca functions
  const perdaMolde = await perdaAlMolde();

  const pesoPeca =  await perdaAlPeca();

  // Calculate pesoTotal
  const pesoTotal =  perdaMolde * 0.08 + pesoPeca * 0.3;
  

  // Send response
  res.send(JSON.stringify({
    PerdaPeca: pesoPeca,
    PerdaMolde: perdaMolde,
    PerdaTotal: pesoTotal
  }));
};

module.exports = {
  perdaAlTotal
};
