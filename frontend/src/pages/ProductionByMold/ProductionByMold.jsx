import React, { useEffect, useState } from "react";
import axios from "axios";

function ProductionByMold() {
	const [month, setMonth] = useState("");
	const [data, setData] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		handleGetData();
	}, [month]);

	const handleGetData = async () => {
		try {
			const response = await axios.get(`http://localhost:4000/producaoMolde`, {
				params: {
					mes: month
				},
			});
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
			setData({});
		}
	};

	const sortedKeys = Object.keys(data).sort(); // Organiza as chaves em ordem alfabética

	return (
		<div className="container">
			<h2>Produção por Molde</h2>
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
			</div>
			<table>
				<thead>
					<tr>
						{sortedKeys.map((key, index) => (
							<th key={index}>{key}</th>
						))}
					</tr>
				</thead>
				<tbody>
					<tr>
						{sortedKeys.map((key, index) => (
							<td key={index}>{data[key]}</td>
						))}
					</tr>
				</tbody>
			</table>
			{error && <div>{error}</div>}
		</div>
	);
}

export default ProductionByMold;
