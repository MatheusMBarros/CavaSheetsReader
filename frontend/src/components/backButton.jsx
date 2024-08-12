import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton() {
	const navigate = useNavigate();

	return <button onClick={() => navigate(-1)}>Voltar</button>;
}

export default BackButton;
