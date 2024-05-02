const { lerPlanilha } = require('../reader');

const disaConsts = () => {
  const spreadsheetId = "1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY";
  const sheetName = 'Disa';
  const range = 'A7:AT1000';
  return { spreadsheetId, sheetName, range };  
};

const cadastroMoldesConst = () => {
  const spreadsheetId = "1zcFd-8PKyAXtVwCPkqQYHgYKbWgF1LWFD31-Y1k-oDY";
  const sheetName = 'cadastro moldes';
  const range = 'A3:O18';
  return { spreadsheetId, sheetName, range };  
};

const filterDataByMonth = async (dataInicial, dataFinal) => {
  try {
    const { spreadsheetId, sheetName, range } = disaConsts()
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



const piecesSplited = async (req , res) => {
  const { dataInicial, dataFinal } = req.query;
  const data = await filterDataByMonth(dataInicial, dataFinal);
  let p16am = 0; 
  let p16af = 0; 
  let p18am = 0; 
  let p18af = 0;   
  let p20am = 0; 
  let p20af = 0; 
  let p22am = 0; 
  let p22af = 0; 
  let p24am = 0; 
  let p24af = 0; 
  let p28am = 0; 
  let p28af = 0; 
  let p32am = 0; 
  let p32af = 0; 
  let f24 = 0; 


  data.forEach((item) => {
    
    if (item[1] == 1){
      p16am += Number(item[7].replace(".", "") * 4);
    }
    if (item[1] == 2){
      p16af += Number(item[7].replace(".", "") * 4);
    }
    if (item[1] == 3){
      p18am += Number(item[7].replace(".", "") * 4);
    } if (item[1] == 4){
      p18af += Number(item[7].replace(".", "") * 4);
    } if (item[1] == 5){
      p20am += Number(item[7].replace(".", "") * 4);
    } if (item[1] == 6){
      p20af += Number(item[7].replace(".", "")  * 3);
    } if (item[1] == 7){
      p22am += Number(item[7].replace(".", "") * 2)
      p18am += Number(item[7].replace(".", ""));
    } if (item[1] == 8){
      p22af += Number(item[7].replace(".", "") * 2);
    } if (item[1] == 9){
      p24am += Number(item[7].replace(".", "")  * 2)
      p16am += Number(item[7].replace(".", ""))
    } if (item[1] == 10){
      p24af += Number(item[7].replace(".", "") * 2)
    } if (item[1] == 11){
      p28am += Number(item[7].replace(".", ""));
      p16am += Number(item[7].replace(".", "") * 2)
    } if (item[1] == 12){
      p28af += Number(item[7].replace(".", ""));
      p16af += Number(item[7].replace(".", "") * 2)
    } if (item[1] == 13){
      p32am += Number(item[7].replace(".", ""));
    } if (item[1] == 14){
      p32af += Number(item[7].replace(".", ""));
    } if (item[1] == 15){
      f24 += Number(item[7].replace(".", "") * 2);
    }
  });
  res.send({
    "F24": f24,
    "P16af": p16af,
    "P16am": p16am,
    "P18af": p18af,
    "P18am": p18am,
    "P20af": p20af,
    "P20am": p20am,
    "P22af": p22af,
    "P22am": p22am,
    "P24af": p24af,
    "P24am": p24am,
    "P28af": p28af,
    "P28am": p28am,
    "P32af": p32af,
    "P32am": p32am    
  });
};

module.exports = { piecesSplited,moldProduction };
