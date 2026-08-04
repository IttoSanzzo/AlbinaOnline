import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./RelatedLocationsList.module.css";
import { UIBasics } from "@/components/(UIBasics)";
import { StpIcon } from "@/libs/stp@icons";
import { LocationLinkDisplay } from "./RelatedLocationsList.components/LocationLinkDisplay";
import { LocationLinkExpanded } from "@/libs/stp@types/dataTypes/locationLink";

const RelatedLocationsListsContainer = newStyledElement.div(
	styles.relatedLocationsListsContainer,
);
const ListContainer = newStyledElement.div(styles.listContainer);

interface RelatedLocationsListProps {
	locationLinks: LocationLinkExpanded[];
	type: "parents" | "children";
	topBorderRadius?: boolean;
	bottomBorderRadius?: boolean;
}
export async function RelatedLocationsList({
	locationLinks,
	type,
	bottomBorderRadius = true,
	topBorderRadius = true,
}: RelatedLocationsListProps) {
	return (
		<RelatedLocationsListsContainer
			style={{
				...(topBorderRadius == false && {
					borderTopLeftRadius: "unset",
					borderTopRightRadius: "unset",
				}),
				...(bottomBorderRadius == false && {
					borderBottomLeftRadius: "unset",
					borderBottomRightRadius: "unset",
				}),
				...(topBorderRadius == false && {
					paddingTop: "0px",
				}),
				...(bottomBorderRadius == false && {
					paddingBottom: "0px",
				}),
			}}>
			{locationLinks.length > 0 && (
				<ListContainer>
					<UIBasics.Header
						headerType="h3"
						textAlign="center"
						textColor="gray"
						className={styles.title}
						withoutMargin>
						<StpIcon
							name="PaperPlaneRight"
							style="bold"
							color={type == "parents" ? "purple" : "blue"}
							mirror={type == "parents"}
						/>
						{type == "parents" ? "Externos" : "Internos"}
						<StpIcon
							name="PaperPlaneRight"
							style="bold"
							color={type == "parents" ? "purple" : "blue"}
							mirror={type == "children"}
						/>
					</UIBasics.Header>
					<UIBasics.List.Grid
						withoutMargin
						withoutPadding
						withoutBorder
						columnWidth={400}
						className={styles.gridStyle}>
						{locationLinks.map((link) => (
							<LocationLinkDisplay
								key={link.id}
								isChild={type == "children"}
								locationLink={link}
							/>
						))}
					</UIBasics.List.Grid>
				</ListContainer>
			)}
		</RelatedLocationsListsContainer>
	);
}
