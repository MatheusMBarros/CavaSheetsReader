import React from "react";

const BackButton = ({ onClick }) => {
	return (
		<button onClick={onClick}>
			<i className="fas fa-arrow-left"></i>
			<span className="sr-only">Voltar</span>
		</button>
	);
};

export default BackButton;
