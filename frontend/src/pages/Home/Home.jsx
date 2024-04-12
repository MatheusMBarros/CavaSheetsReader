import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Importando o arquivo CSS

function Home() {
	return (
		<div className="home-container">
			<div className="content">
				<h1>Bem-vindo de volta Renan</h1>
				<nav>
					<ul>
						<li>
							<Link to="/producaoPorOperador">Produção Por Operador</Link>
						</li>
						<li>
							<Link to="/moldes">Produção por Molde</Link>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default Home;
