import { ReactNode } from "react";
import "./embeds.global.css";

interface LayoutProps {
	children: ReactNode;
}
export default async function Layout({ children }: LayoutProps) {
	return children;
}
