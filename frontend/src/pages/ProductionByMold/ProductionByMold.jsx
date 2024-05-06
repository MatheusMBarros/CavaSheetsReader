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
	const [aluminiumLostData, setAluminiumLostData] = useState({});
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
			const aluminiumLost = await axios.get(`http://localhost:4000/perdaAl`);

			setProductionData(productionResponse.data);
			setMoldProductionData(moldProductionResponse.data);
			setAluminiumLostData(aluminiumLost.data);
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
		<div className="container-moldes">
			<div className="production-table">
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
				<h2>Produção por Peça</h2>
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
						<tr>
							<td colSpan={sortedKeys.length}>
								Total:{" "}
								{Object.values(productionData).reduce(
									(acc, cur) => acc + cur,
									0
								)}
							</td>
						</tr>
					</tbody>
				</table>

				{error && <div>{error}</div>}
			</div>

			<div className="mold-production-table">
				<h2>Produção por Molde</h2>
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
								<td key={mold}>{quantity}</td>
							))}
						<tr>
							<td colSpan={Object.keys(moldProductionData).length}>
								Total:{" "}
								{Object.values(moldProductionData).reduce(
									(acc, cur) => acc + cur,
									0
								)}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="al-lost-table">
				<h2>Alumíno perdido</h2>
				<table>
					<thead>
						<tr>
							{Object.entries(aluminiumLostData)
								.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
								.filter(
									([mold, quantity]) =>
										quantity * moldProductionData[mold] !== 0 &&
										!isNaN(quantity * moldProductionData[mold])
								)
								.map(([mold, quantity]) => (
									<th key={mold}>{mold}</th>
								))}
						</tr>
					</thead>
					<tbody>
						<tr>
							{Object.entries(aluminiumLostData)
								.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
								.filter(
									([mold, quantity]) =>
										quantity * moldProductionData[mold] !== 0 &&
										!isNaN(quantity * moldProductionData[mold])
								)
								.map(([mold, quantity]) => (
									<td key={mold}>
										{(quantity * moldProductionData[mold]).toFixed(3)} Kg
									</td>
								))}
						</tr>
						<tr>
							<td colSpan={Object.keys(aluminiumLostData).length}>
								Total:{" "}
								{Object.entries(aluminiumLostData)
									.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
									.filter(
										([mold, quantity]) =>
											quantity * moldProductionData[mold] !== 0 &&
											!isNaN(quantity * moldProductionData[mold])
									)
									.reduce(
										(acc, [mold, quantity]) =>
											acc + (quantity * moldProductionData[mold] || 0),
										0
									)
									.toFixed(3)
									.toLocaleString("pt-BR")}{" "}
								Kg
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default ProductionByMold;
