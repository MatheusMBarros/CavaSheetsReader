import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DisaProduction.css";
import BackButton from "../../components/backButton"; // Import the BackButton component

function DisaProduction() {
	const [month, setMonth] = useState("");
	const [year] = useState("");
	const [operator, setOperator] = useState("");
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		handleGetData();
	}, [setData, setError]);

	const handleGetData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:4000/producaoOperador`,
				{
					params: {
						mes: month,
						ano: year,
						operador: operator,
					},
				}
			);

			setData(response.data);
			setError(null);
		} catch (error) {
			if (error.response && error.response.status === 429) {
				setError(
					"Limite de solicitações excedido. Tente novamente mais tarde."
				);
			} else if (
				error.response &&
				error.response.data &&
				error.response.data.error
			) {
				setError(error.response.data.error.message);
			} else {
				setError("Ocorreu um erro ao processar a solicitação.");
			}
			setData([]);
		}
	};

	const pecasPorMolde = (molde, moldesProduzidos) => {
		let pecasProduzidas;
		data.forEach((item) => {
			if (item[2] === molde) {
				moldesProduzidos = moldesProduzidos.replace(".", "");

				if (
					item[1] == 1 ||
					item[1] == 2 ||
					item[1] == 3 ||
					item[1] == 4 ||
					item[1] == 5
				) {
					pecasProduzidas = parseFloat(moldesProduzidos * 4);
				}
				if (
					item[1] == 6 ||
					item[1] == 7 ||
					item[1] == 9 ||
					item[1] == 11 ||
					item[1] == 12
				) {
					pecasProduzidas = parseFloat(moldesProduzidos * 3);
				}
				if (item[1] == 8 || item[1] == 10 || item[1] == 15) {
					pecasProduzidas = parseFloat(moldesProduzidos * 2);
				}
				if (item[1] == 13 || item[1] == 14) {
					pecasProduzidas = parseFloat(moldesProduzidos);
				}
			}
		});
		pecasProduzidas = parseFloat(
			pecasProduzidas.toString().replace(/\b\.0\b/, "")
		);

		return parseInt(pecasProduzidas);
	};

	const calcularSomaTotal = () => {
		let soma = 0;
		data.forEach((item) => {
			soma += pecasPorMolde(item[2], item[7]);
		});
		return soma;
	};

	const handleBack = () => {
		window.history.back();
	};

	return (
		<div className="container">
			<h2>Produção por Operador e Data</h2>
			<div className="filters">
				<div className="filter">
					<label>Mês:</label>
					<select value={month} onChange={(e) => setMonth(e.target.value)}>
						<option value="">Selecione o mês</option>
						<option value="01">Janeiro</option>
						<option value="02">Fevereiro</option>
						<option value="03">Março</option>
						<option value="04">Abril</option>
						<option value="05">Maio</option>
						<option value="06">Junho</option>
						<option value="07">Julho</option>
						<option value="08">Agosto</option>
						<option value="09">Setembro</option>
						<option value="10">Outubro</option>
						<option value="11">Novembro</option>
						<option value="12">Dezembro</option>
					</select>
				</div>
				<div className="filter">
					<label>Operador:</label>
					<select
						value={operator}
						onChange={(e) => setOperator(e.target.value)}>
						<option value="">Selecione o operador</option>
						<option value="Vinicius">Vinicius</option>
						<option value="Emanuel">Emanuel</option>
					</select>
				</div>
				<button onClick={handleGetData}>Buscar</button>

				<BackButton onClick={handleBack} />
			</div>
			{error && <p className="error">{error}</p>}
			<div className="table-container">
				<h3>Dados de Produção:</h3>

				<table>
					<thead>
						<tr>
							<th>Data</th>
							<th>Molde</th>
							<th>Operador</th>
							<th>Contador inicial</th>
							<th>Contador Final</th>
							<th>Moldes Produzidos</th>
							<th>Peças</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => {
							return (
								<tr key={index}>
									<td>{item[0]}</td>
									<td>{item[2]}</td>
									<td>{item[4]}</td>
									<td>{item[5]}</td>
									<td>{item[6]}</td>
									<td>{item[7]}</td>
									<td>{pecasPorMolde(item[2], item[7])}</td>
								</tr>
							);
						})}
						<tr>
							<td colSpan="6" style={{ textAlign: "right" }}>
								Soma Total:
							</td>
							<td>{calcularSomaTotal()}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default DisaProduction;
