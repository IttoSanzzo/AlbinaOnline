import {
	NotionBox,
	NotionCallout,
	NotionDivisor,
	NotionQuote,
	NotionTable,
	NotionText,
	NotionToggleHeader,
} from "@/components/(NotionBased)";
import {
	GenericPageContainer,
	GenericPageFooter,
	StyledLink,
} from "@/components/(Design)";
import {
	EmptyLine,
	NotionGridList,
	NotionQuoteList,
} from "@/components/(UTILS)";
import { MasteryData } from "@/libs/stp@types";
import { getCacheMode } from "@/utils/Cache";
import { AnchorProps, SetAnchorNavigation } from "@/libs/stp@hooks";

const anchorNavigationData: AnchorProps[] = [
	{ name: "Proficiências", id: "Proficiências" },
	{ name: "Perícias", id: "Perícias" },
	{ name: "Conhecimentos", id: "Conhecimentos" },
	{ name: "Ofícios", id: "Ofícios" },
];

export default async function MasteriesPage() {
	const response = await fetch(`${process.env.ALBINA_API}/maestrias`, {
		cache: await getCacheMode(),
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
			icon={`${process.env.ALBINA_API}/favicon/core-page/masteries`}
			banner={`${process.env.ALBINA_API}/banner/core-page/masteries`}>
			<NotionDivisor />
			<SetAnchorNavigation anchors={anchorNavigationData} />

			<NotionBox
				backgroundColor="gray"
				withoutPadding>
				<NotionToggleHeader
					memoryId="Proficiências"
					titleAlign="center"
					backgroundColor="gray"
					title={"Proficiências"}>
					<NotionCallout
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
					<NotionCallout backgroundColor="purple">
						<NotionTable
							fixedLineSize={23}
							tableData={{
								tableLanes: [
									[
										<NotionText
											textColor="blue"
											children="Armada"
										/>,
										<NotionText
											textColor="gray"
											children="Relacionada à habilidade e treino com determinados tipos de armas e ferramentas."
										/>,
									],
									[
										<NotionText
											textColor="orange"
											children="Defensiva"
										/>,
										<NotionText
											textColor="gray"
											children="Maestrias no uso “vestido” de determinados equipamento, tais como armaduras e escudos."
										/>,
									],
									[
										<NotionText
											textColor="purple"
											children="Foco"
										/>,
										<NotionText
											textColor="gray"
											children="Relacionada à habilidade para usar focos mágicos, e desempenhar suas taumaturgias através deles."
										/>,
									],
									[
										<NotionText
											textColor="red"
											children="Estilo de Combate"
										/>,
										<NotionText
											textColor="gray"
											children="Capacidade geral do usuário com certa vertente de arma, sendo aplicável de forma menos efetiva a uma gama maior delas."
										/>,
									],
									[
										<NotionText
											textColor="brown"
											children="Ferramenta"
										/>,
										<NotionText
											textColor="gray"
											children="Costume e habilidade do usuário, para manusear e aplicar uso em certas ferramentas."
										/>,
									],
								],
							}}
						/>
					</NotionCallout>
				</NotionToggleHeader>
				<NotionGridList backgroundColor="purple">
					{allProficiencyMasteriesOrdened.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.iconUrl}
						/>
					))}
				</NotionGridList>
			</NotionBox>

			<NotionDivisor />

			<NotionBox
				backgroundColor="gray"
				withoutPadding>
				<NotionToggleHeader
					memoryId="Perícias"
					titleAlign="center"
					backgroundColor="gray"
					title={"Perícias"}>
					<NotionCallout
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
					<NotionCallout backgroundColor="purple">
						<NotionQuoteList
							textColor="gray"
							quotes={[
								"Essas maestrias são aplicadas de forma direta, sempre em um teste de rolagem para as quais, são compatíveis, ou então de forma passiva, para algo na área do mesmo teste em questão. No geral, todas elas tem funcionamento simples, relacionados à rolagens, resistidas por “classes de desafio”. Ao se realizar a jogada, e obter um valor igual ou superior ao necessário, o teste é concluído com êxito, mas baixo disso, é tratada como uma falha, e então entram suas consequências.",
								"Para perícias, um êxito significa que de fato, você foi capaz de executar determinada ação, como um salto, ou contar certa mentira de forma convincente… enquanto, uma falha nesses casos pode ser uma queda para sua morte, ou uma mentira meio óbvia.",
								"Em alguns testes, entretanto, existem circunstâncias especiais de sucesso. Às vezes, tratam-se de razões muito situacionais, outras, pode se tratar de um “teste resistido”. No segundo caso, isso significa que para suceder, você deve ser necessariamente, superior, ao teste, que é de um valor flutuante, provavelmente resultado de um dado lançado por outro indivíduo resistindo à você.",
								"Por curiosidade, ao se executar um teste de perícia com um crítico, fica aberta a escolha ao mestre de uma ou mais opções, entre:[B/Dentro de uma certa proximidade, tornar um teste falho, num êxito, através de habilidade e sorte;][B/Tornar um teste bem sucedido, em algo fenomenal, excedendo seus efeitos de alguma maneira, seja ela visual ou prática;][B/Concedendo XP naquela perícia em específico ao jogador, potencialmente aumentando seu nível nela, mudança essa com efeito imediato sobre a jogada.]",
							]}
						/>
						<NotionQuote
							textColor="gray"
							children={
								<>
									{
										"Todas são divididas em categorias relacionadas diretamente ao Status utilizado para realizá-la: "
									}
									<NotionText
										textColor="red"
										children="Força"
										withBold
									/>
									{", "}
									<NotionText
										textColor="blue"
										children="Agilidade"
										withBold
									/>
									{", "}
									<NotionText
										textColor="green"
										children="Técnica"
										withBold
									/>
									{", "}
									<NotionText
										textColor="orange"
										children="Constituição"
										withBold
									/>
									{", "}
									<NotionText
										textColor="purple"
										children="Inteligência"
										withBold
									/>
									{", "}
									<NotionText
										textColor="pink"
										children="Sabedoria"
										withBold
									/>
									{", e "}
									<NotionText
										textColor="yellow"
										children="Carisma"
										withBold
									/>
									.
								</>
							}
						/>
					</NotionCallout>
				</NotionToggleHeader>
				<NotionGridList backgroundColor="purple">
					{allExpertiseMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.iconUrl}
						/>
					))}
				</NotionGridList>
			</NotionBox>

			<NotionDivisor />

			<NotionBox
				backgroundColor="gray"
				withoutPadding>
				<NotionToggleHeader
					memoryId="Conhecimentos"
					titleAlign="center"
					backgroundColor="gray"
					title={"Conhecimentos"}>
					<NotionCallout
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
					<NotionCallout backgroundColor="purple">
						<NotionQuoteList
							textColor="gray"
							quotes={[
								"Essas maestrias são aplicadas de forma direta, sempre em um teste de rolagem para as quais, são compatíveis, ou então de forma passiva, para algo na área do mesmo teste em questão. No geral, todas elas tem funcionamento simples, relacionados à rolagens, resistidas por “classes de desafio”. Ao se realizar a jogada, e obter um valor igual ou superior ao necessário, o teste é concluído com êxito, mas baixo disso, é tratada como uma falha, e então entram suas consequências.",
								"Para conhecimentos, êxito significa que, você pode saber sobre determinado assunto tratado na ocasião, reconhecer tal elemento de tal lugar, sendo detalhes mínimos, até os mais cruciais ou elaborados, à depender da sua expertise na área e resultado no dado.",
								"Em alguns testes, entretanto, existem circunstâncias especiais de sucesso. Às vezes, tratam-se de razões muito situacionais, outras, pode se tratar de um “teste resistido”. No segundo caso, isso significa que para suceder, você deve ser necessariamente, superior, ao teste, que é de um valor flutuante, provavelmente resultado de um dado lançado por outro indivíduo resistindo à você.",
								"Por curiosidade, ao se executar um teste de conhecimento com um crítico, fica aberta a escolha ao mestre de uma ou mais opções, entre:[B/Dentro de uma certa proximidade, tornar um teste falho, num êxito, através do acaso e sorte;][B/Tornar um teste bem sucedido, em algo fenomenal, excedendo seus efeitos de alguma maneira;][B/Concedendo XP naquele conhecimento em específico ao jogador, potencialmente aumentando seu nível nele, mudança essa com efeito imediato sobre a jogada.]",
							]}
						/>
						<NotionQuote
							textColor="gray"
							children={
								<>
									{"Os conhecimentos são divididos em duas categorias: "}
									<EmptyLine />
									<NotionTable
										fixedLineSize={23}
										tableData={{
											tableLanes: [
												[
													<NotionText
														textColor="blue"
														children="Singular"
													/>,
													<NotionText
														textColor="gray"
														children="Conhecimento relacionado a um determinado tema."
													/>,
												],
												[
													<NotionText
														textColor="orange"
														children="Múltiplo"
													/>,
													<NotionText
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
					</NotionCallout>
				</NotionToggleHeader>
				<NotionGridList backgroundColor="purple">
					{allKnowledgeMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.iconUrl}
						/>
					))}
				</NotionGridList>
			</NotionBox>

			<NotionDivisor />

			<NotionBox
				backgroundColor="gray"
				withoutPadding>
				<NotionToggleHeader
					memoryId="Ofícios"
					titleAlign="center"
					backgroundColor="gray"
					title={"Ofícios"}>
					<NotionCallout
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
					<NotionCallout backgroundColor="purple">
						<NotionQuoteList
							textColor="gray"
							quotes={[
								"Essas maestrias possuem uma gama ampla de aplicações. Assim como perícias e conhecimentos, seu nível vale nos testes gerais relacionados diretamente à área do ofício em questão, como ao desempenhar a profissão em si. Por exemplo, um cocheiro, poder usar sua maestria nisso para cavalgar, ao invés da perícia [@/maestrias/cavalgar].",
								"Como o nome já aponta, o principal aspecto dos ofícios, é que eles são formas de trabalho, não relacionados necessáriamente ao combate, e portanto, são geralmente uma possível fonte de renda, partindo da sua exerção, através do jogador.",
							]}
						/>
						<NotionQuote
							textColor="gray"
							children={
								<>
									{"Os ofícios são divididos em três categorias: "}
									<EmptyLine />
									<NotionTable
										fixedLineSize={23}
										tableData={{
											tableLanes: [
												[
													<NotionText
														textColor="green"
														children="Geral"
													/>,
													<NotionText
														textColor="gray"
														children="Ofícios com uma ampla gama de funções desempenhadas, ou então que não se encaixa em nenhuma das outras categorias."
													/>,
												],
												[
													<NotionText
														textColor="blue"
														children="Produção"
													/>,
													<NotionText
														textColor="gray"
														children="Ofícios desempenhados através da criação, construção e/ou produção de bens, objetos e/ou estruturas."
													/>,
												],
												[
													<NotionText
														textColor="red"
														children="Combate"
													/>,
													<NotionText
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
					</NotionCallout>
				</NotionToggleHeader>
				<NotionGridList backgroundColor="purple">
					{allCraftMasteries.map((masteryData) => (
						<StyledLink
							key={masteryData.id}
							title={masteryData.name}
							href={`/maestrias/${masteryData.slug}`}
							icon={masteryData.iconUrl}
						/>
					))}
				</NotionGridList>
			</NotionBox>

			<GenericPageFooter version="7.0.0" />
		</GenericPageContainer>
	);
}
