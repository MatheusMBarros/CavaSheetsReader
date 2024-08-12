import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/BackButton"; // Import the BackButton component

function ProductionAndAluminiumLost() {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [filterStartDate, setFilterStartDate] = useState("");
	const [filterEndDate, setFilterEndDate] = useState("");
	const [pieceProductionData, setPieceProductionData] = useState([]);
	const [moldProductionData, setMoldProductionData] = useState({});
	const [aluminiumLostData, setAluminiumLostData] = useState({});
	const [pieceMap, setPieceMap] = useState({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Define datas iniciais e finais
		const today = new Date();
		const currentYear = today.getFullYear();
		const initialDate = `${currentYear}-01-01`;
		const finalDate = today.toISOString().split("T")[0];

		setStartDate(initialDate);
		setEndDate(finalDate);
		setFilterStartDate(initialDate);
		setFilterEndDate(finalDate);
	}, []);

	useEffect(() => {
		// Fetch piece details from the API endpoint
		const fetchPieceDetails = async () => {
			try {
				const response = await axios.get("http://localhost:4000/pieces");
				const pieceDetails = response.data;
				// Map piece names
				const mappedPieces = {};
				pieceDetails.forEach((piece) => {
					mappedPieces[piece[1]] = piece[1];
				});
				setPieceMap(mappedPieces);
			} catch (error) {
				console.error("Error fetching piece details:", error);
			}
		};
		fetchPieceDetails();
	}, []);

	const handleGetData = async () => {
		setLoading(true);
		try {
			const pieceProductionResponse = await axios.get(
				`http://localhost:4000/pieceProduction`,
				{
					params: {
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

			setPieceProductionData(pieceProductionResponse.data);
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
			setPieceProductionData([]);
			setMoldProductionData({});
			setAluminiumLostData({});
		}
		setLoading(false);
	};

	const handleFilter = () => {
		setFilterStartDate(startDate);
		setFilterEndDate(endDate);
		handleGetData();
	};

	const handleBack = () => {
		window.history.back();
	};

	const calculateTotalAluminiumLost = () => {
		return Object.entries(aluminiumLostData).reduce((total, [mold, lost]) => {
			const produced = moldProductionData[mold] || 0;
			return total + lost * produced;
		}, 0);
	};

	useEffect(() => {
		// Fetch initial data when dates are set
		if (filterStartDate && filterEndDate) {
			handleGetData();
		}
	}, [filterStartDate, filterEndDate]);

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
					<button onClick={handleFilter}>Enviar</button>
					<BackButton onClick={handleBack} />
				</div>
				{loading ? (
					<p>Carregando dados...</p>
				) : (
					<>
						<h2>Produção por Peça</h2>
						<table>
							<thead>
								<tr>
									{Object.entries(pieceMap).map(([name, id]) => (
										<th key={id}>{id}</th>
									))}
								</tr>
							</thead>
							<tbody>
								<tr>
									{Object.entries(pieceMap).map(([id, name]) => (
										<td key={id}>{pieceProductionData[id] || 0}</td>
									))}
								</tr>
								<tr>
									<td colSpan={Object.keys(pieceMap).length}>
										Total:{" "}
										{Object.values(pieceProductionData).reduce(
											(acc, production) => acc + production,
											0
										)}
									</td>
								</tr>
							</tbody>
						</table>

						{error && <div>{error}</div>}
					</>
				)}
			</div>

			{!loading && (
				<>
					<div className="mold-production-table">
						<h2>Produção por Molde</h2>
						<table>
							<thead>
								<tr>
									{Object.entries(moldProductionData)
										.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
										.map(([mold]) => (
											<th key={mold}>{mold}</th>
										))}
								</tr>
							</thead>
							<tbody>
								<tr>
									{Object.entries(moldProductionData)
										.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
										.map(([mold, quantity]) => (
											<td key={mold}>{quantity}</td>
										))}
								</tr>
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
						<h2>Alumínio perdido</h2>
						<table>
							<thead>
								<tr>
									{Object.entries(aluminiumLostData)
										.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
										.filter(
											([mold, lost]) => moldProductionData[mold] !== undefined
										)
										.map(([mold]) => (
											<th key={mold}>{mold}</th>
										))}
								</tr>
							</thead>
							<tbody>
								<tr>
									{Object.entries(aluminiumLostData)
										.sort(([moldA], [moldB]) => moldA.localeCompare(moldB))
										.filter(
											([mold, lost]) => moldProductionData[mold] !== undefined
										)
										.map(([mold, lost]) => (
											<td key={mold}>
												{(lost * moldProductionData[mold]).toFixed(3)} Kg
											</td>
										))}
								</tr>
								<tr>
									<td colSpan={Object.keys(aluminiumLostData).length}>
										Total: {calculateTotalAluminiumLost().toFixed(3)} Kg
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</>
			)}
		</div>
	);
}

export default ProductionAndAluminiumLost;
