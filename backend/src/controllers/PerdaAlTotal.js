const { lerPlanilha } = require('../reader');

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

const aluminiumLost = async (req, res) => {
  const { id } = req.params
  const { spreadsheetId, sheetName, range } = moldeConsts() // Adicione os parênteses para chamar a função moldeConsts

  try {
    const data = await lerPlanilha(spreadsheetId, sheetName, range)
    
    // Array para armazenar os dados dos itens com quantidade de peças igual a 4
    const itensQtdPecas4 = []

    data.forEach((item) => {
      // Verifica se a quantidade de peças é igual a 4
      if (item[10]  === "4") {
        // Se sim, adiciona o item ao array
        itensQtdPecas4.push(item)
      }
    })

    res.send(itensQtdPecas4) // Retorna os itens com quantidade de peças igual a 4
  } catch (error) {
    console.error("Erro ao ler planilha:", error)
    res.status(500).send("Erro ao processar a requisição")
  }
}

module.exports = { aluminiumLost }
