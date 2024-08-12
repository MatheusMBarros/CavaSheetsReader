import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SelectProduction() {
	const [loteId, setLoteId] = useState("");
	const navigate = useNavigate();

	const handleSearch = () => {
		if (loteId.trim() !== "") {
			navigate(`/lote/${loteId}`);
		}
	};

	return (
		<div>
			<h1>Buscar Pallet</h1>
			<input
				type="text"
				value={loteId}
				onChange={(e) => setLoteId(e.target.value)}
				placeholder="Digite o ID do Lote"
			/>
			<button onClick={handleSearch}>Buscar</button>
		</div>
	);
}

export default SelectProduction;
