const { lerPlanilha } = require('../reader');


const perdaAlTotal = async (req, res) => {
  const { id } = req.params;

  const perdaAlMolde = async (req, res) => {
  
    // ID da planilha
    const spreadsheetId = "1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY";
  
    // Nome da planilha
    const sheetName = 'cadastro moldes';
  
    // Intervalo de células
    const range = 'A3:O18';
  
    // Chame a função lerPlanilha com o spreadsheetId e o range
    const data = await lerPlanilha(spreadsheetId, sheetName, range);
  
  const pesoMolde = data.filter(item => item[0] === id);
    let pesoBruto = pesoMolde[0][11]
    pesoBruto = Number(pesoBruto.replace("," , "."))
    let pesoPronto = pesoMolde[0][12]
    pesoPronto = Number(pesoPronto.replace("," , "."))


    const perdaAlMolde = pesoBruto - pesoPronto
    
    return perdaAlMolde    
}

  const perdaAlPeca = async (req, res) => {
  
    // ID da planilha
    const spreadsheetId = "1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY";
  
    // Nome da planilha
    const sheetName = 'cadastro moldes';
  
    // Intervalo de células
    const range = 'A3:O18';
  
    // Chame a função lerPlanilha com o spreadsheetId e o range
    const data = await lerPlanilha(spreadsheetId, sheetName, range);
    
  //  // Encontra todos os itens que correspondem ao id e retorna apenas a diferença entre item[11] e item[12] de cada item
  const diferencaPesos = data.filter(item => item[0] === id)

    return diferencaPesos[0][13]
  };


// const perdaMolde = await perdaAlMolde(id)

const pesoPeca =  await perdaAlPeca(id)

// const pesoTotal = (Number(perdaMolde) * 0.08) + (Number(pesoPeca) * 0.3)

res.send(JSON.stringify("PerdaPeça: " + pesoPeca))

};

module.exports = {
  perdaAlTotal
};
