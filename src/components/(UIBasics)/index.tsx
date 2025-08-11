import * as BasicComponents from "./components";

export const UIBasics = {
	Box: BasicComponents.Box,
	Text: BasicComponents.Text,
	Bullet: BasicComponents.Bullet,
	Callout: BasicComponents.Callout,
	Quote: BasicComponents.Quote,
	Toggle: BasicComponents.Toggle,
	Header: BasicComponents.Header,
	ToggleHeader: BasicComponents.ToggleHeader,
	Table: BasicComponents.Table,
	Divisor: BasicComponents.Divisor,
	Carousel: BasicComponents.Carousel,
	EmptyLine: BasicComponents.EmptyLine,
	List: {
		Grid: BasicComponents.GridList,
		Bullet: BasicComponents.BulletList,
		Quote: BasicComponents.QuoteList,
	},
	MultiColumn: {
		Two: BasicComponents.TwoColumns,
	},
};

export * from "./utils";
export * from "./core";
