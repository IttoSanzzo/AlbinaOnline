import Layout from "./(site)/layout";

export default function NotFound() {
	return (
		<Layout>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					marginTop: "45%",
					alignItems: "center",
				}}
				className="p-8 text-center">
				<h1 className="text-4xl font-bold mb-4">404 | Página não encontrada</h1>
				<p className="text-lg">
					A página que você tentou acessar não existe ou foi movida.
				</p>
			</div>
		</Layout>
	);
}
