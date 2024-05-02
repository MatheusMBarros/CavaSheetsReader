import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DisaProduction.css";
import BackButton from "../../components/backButton"; // Import the BackButton component

function DisaProduction() {
	const [startDate, setStartDate] = useState(""); // State for start date
	const [endDate, setEndDate] = useState(""); // State for end date
	const [operator, setOperator] = useState("");
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [mold, setMold] = useState(""); // New state for mold filter

	useEffect(() => {
		handleGetData();
	}, [startDate, endDate, operator, mold]); // Trigger the effect whenever the filters change

	const handleGetData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:4000/producaoOperador`,
				{
					params: {
						dataInicial: startDate,
						dataFinal: endDate,
						operador: operator,
						molde: mold,
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

	const somaMoldes = () => {
		let sum = 0;
		data.forEach((item) => (sum += parseInt(item[11])));
		return sum;
	};

	const pecasPorMolde = (molde, moldesProduzidos) => {
		let pecasProduzidas = 0;
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
					<label>Data Inicial:</label>
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
					/>
				</div>
				<div className="filter">
					<label>Data Final:</label>
					<input
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
					/>
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
				<div className="filter">
					{" "}
					<label>Molde:</label>
					<select value={mold} onChange={(e) => setMold(e.target.value)}>
						<option value="">Selecione o molde</option>
						<option value="1">Molde P16 AM</option>
						<option value="2">Molde P16 AF</option>
						<option value="3">Molde P18 AM</option>
						<option value="4">Molde P18 AF</option>
						<option value="5">Molde P20 AM</option>
						<option value="6">Molde P20 AF</option>
						<option value="7">Molde P22 AM</option>
						<option value="8">Molde P22 AF</option>
						<option value="9">Molde P24 AM</option>
						<option value="10">Molde P24 AF</option>
						<option value="11">Molde P28 AM</option>
						<option value="12">Molde P28 AF</option>
						<option value="13">Molde P32 AM</option>
						<option value="14">Molde P32 AF</option>
						<option value="15">Molde F24</option>
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
								Soma Peças:
							</td>
							<td>{calcularSomaTotal()}</td>
						</tr>
						<tr>
							<td colSpan="6" style={{ textAlign: "right" }}>
								Soma Moldes:
							</td>
							<td>{somaMoldes()}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default DisaProduction;
