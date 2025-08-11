import {
	GenericPageContainer,
	GenericPageFooter,
	StyledLink,
} from "@/components/(Design)";
import { MasteryData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";
import { UIBasics } from "@/components/(UIBasics)";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Proficiências", id: "Proficiências" },
	{ name: "Perícias", id: "Perícias" },
	{ name: "Conhecimentos", id: "Conhecimentos" },
	{ name: "Ofícios", id: "Ofícios" },
];

export default async function MasteriesPage() {
	const response = await fetch(getAlbinaApiAddress("/maestrias"), {
		cache: getCacheMode(),
	});
	const allRawMasteries: MasteryData[] = await response.json();
	const allMasteries: MasteryData[] = allRawMasteries.sort((a, b) =>
		a.name.localeCompare(b.name)
	);
	const allProficiencyMasteries = allMasteries.filter(
		(mastery) => mastery.type === "Proficiency"
	);
	const allProficiencyMasteriesOrdened: MasteryData[] = [];
	["Armed", "Armored", "Focus", "CombatStyle", "Tool"].forEach(
		(proficiencyCategory) => {
			allProficiencyMasteries.forEach((mastery) => {
				if (mastery.subType == proficiencyCategory)
					allProficiencyMasteriesOrdened.push(mastery);
			});
		}
	);

	const allExpertiseMasteries = allMasteries.filter(
		(mastery) => mastery.type === "Expertise"
	);
	const allKnowledgeMasteries = allMasteries.filter(
		(mastery) => mastery.type === "Knowledge"
	);
	const allCraftMasteries = allMasteries.filter(
		(mastery) => mastery.type === "Craft"
	);

	return (
		<GenericPageContainer
			title="Maestrias"
			icon={getAlbinaApiAddress("/favicon/core-page/masteries")}
			banner={getAlbinaApiAddress("/banner/core-page/masteries")}>
			<UIBasics.Divisor />
			<SetAnchorNavigation anchors={anchorNavigationData} />

			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.ToggleHeader
					memoryId="Proficiências"
					titleAlign="center"
					backgroundColor="gray"
					title={"Proficiências"}>
					<UIBasics.Callout
						backgroundColor="blue"
						titleColor="orange"
						icon={{
							name: "Lightbulb",
							color: "yellow",
						}}
						title={
							"“Coeficientes evolutivos relacionados à habilidade de usar ferramentas de objetos.”"
						}
					/>
					<UIBasics.Callout backgroundColor="purple">
						<UIBasics.Table
							fixedLinePositions={[1]}
							fixedLineWidths={[23]}
							tableData={{
								tableLanes: [
									[
										<UIBasics.Text
											textColor="blue"
											children="Armada"
										/>,
										<UIBasics.Text
											textColor="gray"
											children="Relacionada à habilidade e treino com determinados tipos de armas e ferramentas."
										/>,
									],
									[
										<UIBasics.Text
											textColor="orange"
											children="Defensiva"
										/>,
										<UIBasics.Text
											textColor="gray"
											children="Maestrias no uso “vestido” de determinados equipamento, tais como armaduras e escudos."
										/>,
									],
									[
										<UIBasics.Text
											textColor="purple"
											children="Foco"
										/>,
										<UIBasics.Text
											textColor="gray"
											children="Relacionada à habilidade para usar focos mágicos, e desempenhar suas taumaturgias através deles."
										/>,
									],
									[
										<UIBasics.Text
											textColor="red"
											children="Estilo de Combate"
										/>,
										<UIBasics.Text
											textColor="gray"
											children="Capacidade geral do usuário com certa vertente de arma, sendo aplicável de forma menos efetiva a uma gama maior delas."
										/>,
									],
									[
										<UIBasics.Text
											textColor="brown"
											children="Ferramenta"
										/>,
										<UIBasics.Text
											textColor="gray"
											children="Costume e habilidade do usuário, para manusear e aplicar uso em certas ferramentas."
										/>,
									],
								],
							}}
						/>
					</UIBasics.Callout>
				</UIBasics.ToggleHeader>
				<UIBasics.List.Grid backgroundColor="purple">
					{allProficiencyMasteriesOrdened.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.iconUrl}
						/>
					))}
				</UIBasics.List.Grid>
			</UIBasics.Box>

			<UIBasics.Divisor />

			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.ToggleHeader
					memoryId="Perícias"
					titleAlign="center"
					backgroundColor="gray"
					title={"Perícias"}>
					<UIBasics.Callout
						backgroundColor="blue"
						titleColor="orange"
						icon={{
							name: "Lightbulb",
							color: "yellow",
						}}
						title={
							"“Coeficientes evolutivos diretamente relacionados à suas expertises práticas.”"
						}
					/>
					<UIBasics.Callout backgroundColor="purple">
						<UIBasics.List.Quote
							textColor="gray"
							quotes={[
								"Essas maestrias são aplicadas de forma direta, sempre em um teste de rolagem para as quais, são compatíveis, ou então de forma passiva, para algo na área do mesmo teste em questão. No geral, todas elas tem funcionamento simples, relacionados à rolagens, resistidas por “classes de desafio”. Ao se realizar a jogada, e obter um valor igual ou superior ao necessário, o teste é concluído com êxito, mas baixo disso, é tratada como uma falha, e então entram suas consequências.",
								"Para perícias, um êxito significa que de fato, você foi capaz de executar determinada ação, como um salto, ou contar certa mentira de forma convincente… enquanto, uma falha nesses casos pode ser uma queda para sua morte, ou uma mentira meio óbvia.",
								"Em alguns testes, entretanto, existem circunstâncias especiais de sucesso. Às vezes, tratam-se de razões muito situacionais, outras, pode se tratar de um “teste resistido”. No segundo caso, isso significa que para suceder, você deve ser necessariamente, superior, ao teste, que é de um valor flutuante, provavelmente resultado de um dado lançado por outro indivíduo resistindo à você.",
								"Por curiosidade, ao se executar um teste de perícia com um crítico, fica aberta a escolha ao mestre de uma ou mais opções, entre:[B/Dentro de uma certa proximidade, tornar um teste falho, num êxito, através de habilidade e sorte;][B/Tornar um teste bem sucedido, em algo fenomenal, excedendo seus efeitos de alguma maneira, seja ela visual ou prática;][B/Concedendo XP naquela perícia em específico ao jogador, potencialmente aumentando seu nível nela, mudança essa com efeito imediato sobre a jogada.]",
							]}
						/>
						<UIBasics.Quote
							textColor="gray"
							children={
								<>
									{
										"Todas são divididas em categorias relacionadas diretamente ao Status utilizado para realizá-la: "
									}
									<UIBasics.Text
										textColor="red"
										children="Força"
										withBold
									/>
									{", "}
									<UIBasics.Text
										textColor="blue"
										children="Agilidade"
										withBold
									/>
									{", "}
									<UIBasics.Text
										textColor="green"
										children="Técnica"
										withBold
									/>
									{", "}
									<UIBasics.Text
										textColor="orange"
										children="Constituição"
										withBold
									/>
									{", "}
									<UIBasics.Text
										textColor="purple"
										children="Inteligência"
										withBold
									/>
									{", "}
									<UIBasics.Text
										textColor="pink"
										children="Sabedoria"
										withBold
									/>
									{", e "}
									<UIBasics.Text
										textColor="yellow"
										children="Carisma"
										withBold
									/>
									.
								</>
							}
						/>
					</UIBasics.Callout>
				</UIBasics.ToggleHeader>
				<UIBasics.List.Grid backgroundColor="purple">
					{allExpertiseMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.iconUrl}
						/>
					))}
				</UIBasics.List.Grid>
			</UIBasics.Box>

			<UIBasics.Divisor />

			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.ToggleHeader
					memoryId="Conhecimentos"
					titleAlign="center"
					backgroundColor="gray"
					title={"Conhecimentos"}>
					<UIBasics.Callout
						backgroundColor="blue"
						titleColor="orange"
						icon={{
							name: "Lightbulb",
							color: "yellow",
						}}
						title={
							"“Coeficientes evolutivos diretamente relacionados à suas expertises teóricas.”"
						}
					/>
					<UIBasics.Callout backgroundColor="purple">
						<UIBasics.List.Quote
							textColor="gray"
							quotes={[
								"Essas maestrias são aplicadas de forma direta, sempre em um teste de rolagem para as quais, são compatíveis, ou então de forma passiva, para algo na área do mesmo teste em questão. No geral, todas elas tem funcionamento simples, relacionados à rolagens, resistidas por “classes de desafio”. Ao se realizar a jogada, e obter um valor igual ou superior ao necessário, o teste é concluído com êxito, mas baixo disso, é tratada como uma falha, e então entram suas consequências.",
								"Para conhecimentos, êxito significa que, você pode saber sobre determinado assunto tratado na ocasião, reconhecer tal elemento de tal lugar, sendo detalhes mínimos, até os mais cruciais ou elaborados, à depender da sua expertise na área e resultado no dado.",
								"Em alguns testes, entretanto, existem circunstâncias especiais de sucesso. Às vezes, tratam-se de razões muito situacionais, outras, pode se tratar de um “teste resistido”. No segundo caso, isso significa que para suceder, você deve ser necessariamente, superior, ao teste, que é de um valor flutuante, provavelmente resultado de um dado lançado por outro indivíduo resistindo à você.",
								"Por curiosidade, ao se executar um teste de conhecimento com um crítico, fica aberta a escolha ao mestre de uma ou mais opções, entre:[B/Dentro de uma certa proximidade, tornar um teste falho, num êxito, através do acaso e sorte;][B/Tornar um teste bem sucedido, em algo fenomenal, excedendo seus efeitos de alguma maneira;][B/Concedendo XP naquele conhecimento em específico ao jogador, potencialmente aumentando seu nível nele, mudança essa com efeito imediato sobre a jogada.]",
							]}
						/>
						<UIBasics.Quote
							textColor="gray"
							children={
								<>
									{"Os conhecimentos são divididos em duas categorias: "}
									<UIBasics.EmptyLine />
									<UIBasics.Table
										fixedLinePositions={[1]}
										fixedLineWidths={[23]}
										tableData={{
											tableLanes: [
												[
													<UIBasics.Text
														textColor="blue"
														children="Singular"
													/>,
													<UIBasics.Text
														textColor="gray"
														children="Conhecimento relacionado a um determinado tema."
													/>,
												],
												[
													<UIBasics.Text
														textColor="orange"
														children="Múltiplo"
													/>,
													<UIBasics.Text
														textColor="gray"
														children="Conhecimento em uma vertente expecífica de um determinado tema."
													/>,
												],
											],
										}}
									/>
								</>
							}
						/>
					</UIBasics.Callout>
				</UIBasics.ToggleHeader>
				<UIBasics.List.Grid backgroundColor="purple">
					{allKnowledgeMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.iconUrl}
						/>
					))}
				</UIBasics.List.Grid>
			</UIBasics.Box>

			<UIBasics.Divisor />

			<UIBasics.Box
				backgroundColor="gray"
				withoutPadding>
				<UIBasics.ToggleHeader
					memoryId="Ofícios"
					titleAlign="center"
					backgroundColor="gray"
					title={"Ofícios"}>
					<UIBasics.Callout
						backgroundColor="blue"
						titleColor="orange"
						icon={{
							name: "Lightbulb",
							color: "yellow",
						}}
						title={
							"“Expertise em determinado conjunto de áreas, que sejam diretamente relacionadas ao termo profissional, ou que se tratem de uma, ou várias, atividades.”"
						}
					/>
					<UIBasics.Callout backgroundColor="purple">
						<UIBasics.List.Quote
							textColor="gray"
							quotes={[
								"Essas maestrias possuem uma gama ampla de aplicações. Assim como perícias e conhecimentos, seu nível vale nos testes gerais relacionados diretamente à área do ofício em questão, como ao desempenhar a profissão em si. Por exemplo, um cocheiro, poder usar sua maestria nisso para cavalgar, ao invés da perícia [@/maestrias/cavalgar].",
								"Como o nome já aponta, o principal aspecto dos ofícios, é que eles são formas de trabalho, não relacionados necessáriamente ao combate, e portanto, são geralmente uma possível fonte de renda, partindo da sua exerção, através do jogador.",
							]}
						/>
						<UIBasics.Quote
							textColor="gray"
							children={
								<>
									{"Os ofícios são divididos em três categorias: "}
									<UIBasics.EmptyLine />
									<UIBasics.Table
										fixedLinePositions={[1]}
										fixedLineWidths={[23]}
										tableData={{
											tableLanes: [
												[
													<UIBasics.Text
														textColor="green"
														children="Geral"
													/>,
													<UIBasics.Text
														textColor="gray"
														children="Ofícios com uma ampla gama de funções desempenhadas, ou então que não se encaixa em nenhuma das outras categorias."
													/>,
												],
												[
													<UIBasics.Text
														textColor="blue"
														children="Produção"
													/>,
													<UIBasics.Text
														textColor="gray"
														children="Ofícios desempenhados através da criação, construção e/ou produção de bens, objetos e/ou estruturas."
													/>,
												],
												[
													<UIBasics.Text
														textColor="red"
														children="Combate"
													/>,
													<UIBasics.Text
														textColor="gray"
														children="Ofícios desempenhados em meio ao confronto direto, ou relacionados de alguma maneira, ao combate."
													/>,
												],
											],
										}}
									/>
								</>
							}
						/>
					</UIBasics.Callout>
				</UIBasics.ToggleHeader>
				<UIBasics.List.Grid backgroundColor="purple">
					{allCraftMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.iconUrl}
						/>
					))}
				</UIBasics.List.Grid>
			</UIBasics.Box>

			<GenericPageFooter version="7.0.0" />
		</GenericPageContainer>
	);
}
