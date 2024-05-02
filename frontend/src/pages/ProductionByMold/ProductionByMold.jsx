import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductionByMoldStyle.css";
import BackButton from "../../components/backButton"; // Import the BackButton component

function ProductionByMold() {
	const [month, setMonth] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [productionData, setProductionData] = useState({});
	const [moldProductionData, setMoldProductionData] = useState({});
	const [error, setError] = useState(null);

	useEffect(() => {
		handleGetData();
	}, [month, startDate, endDate]);

	const handleGetData = async () => {
		try {
			const productionResponse = await axios.get(
				`http://localhost:4000/producaoMolde`,
				{
					params: {
						mes: month,
						dataInicial: startDate,
						dataFinal: endDate,
					},
				}
			);

			const moldProductionResponse = await axios.get(
				`http://localhost:4000/moldesProduzidos`,
				{
					params: {
						dataInicial: startDate,
						dataFinal: endDate,
					},
				}
			);

			setProductionData(productionResponse.data);
			setMoldProductionData(moldProductionResponse.data);
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
			setProductionData({});
			setMoldProductionData({});
		}
	};

	const sortedKeys = Object.keys(productionData)
		.filter((key) => productionData[key] !== 0)
		.sort(); // Organiza as chaves em ordem alfabética

	const handleBack = () => {
		window.history.back();
	};
	return (
		<div className="container">
			<div className="production-table">
				<h2>Produção por Molde</h2>
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
					<BackButton onClick={handleBack} />
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
								<td key={index}>{productionData[key]}</td>
							))}
						</tr>
					</tbody>
				</table>

				{error && <div>{error}</div>}
			</div>

			<div className="mold-production-table">
				<table>
					<thead>
						<tr>
							{Object.entries(moldProductionData)
								.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
								.map(([mold, quantity]) => (
									<th key={mold}>{mold}</th>
								))}
						</tr>
					</thead>
					<tbody>
						{Object.entries(moldProductionData)
							.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
							.map(([mold, quantity]) => (
								<td key={mold}>
									<tr>{quantity}</tr>
								</td>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default ProductionByMold;
