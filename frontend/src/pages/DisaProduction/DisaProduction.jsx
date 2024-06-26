import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../../components/backButton";

function DisaProduction() {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [operator, setOperator] = useState("");
	const [data, setData] = useState([]);
	const [error, setError] = useState(null);
	const [moldOptions, setMoldOptions] = useState([]); // State to hold mold options
	const [moldFilter, setMoldFilter] = useState("");
	const [moldQuantities, setMoldQuantities] = useState({});

	useEffect(() => {
		handleGetData();
	}, [startDate, endDate, operator, moldFilter]);

	const handleGetData = async () => {
		try {
			const response = await axios.get(`http://localhost:4000/disaData`, {
				params: {
					dataInicial: startDate,
					dataFinal: endDate,
					operador: operator,
					molde: moldFilter,
				},
			});

			const moldData = await axios.get(`http://localhost:4000/mold`);
			const moldOptions = moldData.data.map((mold) => ({
				value: mold[0],
				label: mold[1],
			}));
			setMoldOptions(moldOptions);

			const moldQuantities = moldData.data.reduce((acc, mold) => {
				acc[mold[0]] = parseNumber(mold[2]);
				return acc;
			}, {});
			setMoldQuantities(moldQuantities);

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

	const handleBack = () => {
		window.history.back();
	};

	const parseNumber = (value) => {
		return Number(value.replace(/\D/g, "")) || 0;
	};

	const getMoldQuantity = (moldId) => {
		return moldQuantities[moldId] || 0;
	};

	const calculateTotalMolds = (items) => {
		return items.reduce((acc, item) => acc + parseNumber(item[7]), 0);
	};

	const calculateTotalPieces = (items) => {
		return items.reduce(
			(acc, item) => acc + getMoldQuantity(item[1]) * parseNumber(item[7]),
			0
		);
	};

	const totalMolds = calculateTotalMolds(data);
	const totalPieces = calculateTotalPieces(data);

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
					<label>Molde:</label>
					<select
						value={moldFilter}
						onChange={(e) => setMoldFilter(e.target.value)}>
						<option value="">Selecione o molde</option>
						{moldOptions.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
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
							const moldId = item[1];
							const pieces = getMoldQuantity(moldId) * parseNumber(item[7]);
							return (
								<tr key={index}>
									<td>{item[0]}</td>
									<td>{item[2]}</td>
									<td>{item[4]}</td>
									<td>{parseNumber(item[5])}</td>
									<td>{parseNumber(item[6])}</td>
									<td>{parseNumber(item[7])}</td>
									<td>{pieces}</td>
								</tr>
							);
						})}
						<tr>
							<td colSpan="6" style={{ textAlign: "right" }}>
								Soma Peças:
							</td>
							<td>{totalPieces}</td>
						</tr>
						<tr>
							<td colSpan="6" style={{ textAlign: "right" }}>
								Soma Moldes:
							</td>
							<td>{totalMolds}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default DisaProduction;
