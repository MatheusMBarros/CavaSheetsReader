import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
	return (
		<div className="home-content">
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
						<li>
							<Link to="/corteCanal">CorteCanal</Link>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default Home;
