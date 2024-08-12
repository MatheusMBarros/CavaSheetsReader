import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "./BackButton";
import CreateNewPalletButton from "../components/CreateNewPalletButton";

function PalletDetails() {
	const { id } = useParams();
	const [loteData, setLoteData] = useState(null);
	const [pieceProductionData, setPieceProductionData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchLoteData = async () => {
			try {
				const response = await axios.get(
					`http://localhost:4000/loteInfo/${id}`
				);
				setLoteData(response.data);
			} catch (err) {
				setError(err.message);
			}
		};

		const fetchPieceProductionData = async () => {
			try {
				const response = await axios.get(
					`http://localhost:4000/production-by-lote`,
					{
						params: {
							lote: id,
						},
					}
				);
				setPieceProductionData(response.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchLoteData();
		fetchPieceProductionData();
	}, [id]);

	if (loading) {
		return <div>Carregando...</div>;
	}

	if (error) {
		return <div>Erro: {error}</div>;
	}

	const loteId = loteData ? loteData.loteId : null;
	const pieceType = "TipoDePeçaExemplo"; // Substitua pelo valor correto

	return (
		<div>
			<h1>Detalhes do Lote {id}</h1>
			<BackButton />
			{loteData && (
				<div>
					<p>Numeração: {loteData.loteId}</p>
					<p>Data: {loteData.date}</p>
					<p>Molde: {loteData.mold}</p>
					<p>Quantidade de Moldes: {loteData.moldQuantity}</p>
					<ul>
						{loteData.pieces &&
							Object.entries(loteData.pieces).map(
								([piece, quantity], index) => (
									<li key={index}>
										{piece}: {quantity}
									</li>
								)
							)}
					</ul>
				</div>
			)}
			{pieceProductionData && (
				<div>
					<h3>Produção de Peças do Lote:</h3>
					<ul>
						{pieceProductionData &&
							Object.entries(pieceProductionData).map(
								([piece, quantity], index) => (
									<li key={index}>
										{piece}: {quantity}
									</li>
								)
							)}
					</ul>
				</div>
			)}
			<div className="createPalletButton">
				<CreateNewPalletButton loteId={loteId} />
			</div>
		</div>
	);
}

export default PalletDetails;
