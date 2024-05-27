const { google } = require('googleapis');


async function getAuthSheets(){
  const auth = new google.auth.GoogleAuth({
    keyFile:  "./src/key/sistema-cava-5748ae84a2d3.json",
    scopes:  "https://www.googleapis.com/auth/spreadsheets"
  })

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client
  })

  return {
    auth, 
    client , 
    googleSheets
  }
}


async function lerPlanilha(spreadsheetId, sheetName, range) {
  const { googleSheets, auth } = await getAuthSheets();

  // Obter os valores da planilha
  const response = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: `${sheetName}!${range}`, // Adiciona o nome da planilha ao range
  });

  // Extrair os valores da resposta
  const rows = response.data.values;

  return rows

}


module.exports = { lerPlanilha };
