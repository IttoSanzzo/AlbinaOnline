import styles from "./CursorSvg.module.css";

interface CursorIconProps {
	type?: string;
	mainColor?: string;
	secondaryColor?: string;
}
export function CursorSvg({
	type,
	mainColor = "var(--cl-gray-200)",
	secondaryColor = "var(--cl-gray-900)",
}: CursorIconProps) {
	switch (type) {
		case "Default":
		default:
			return (
				<DefaultCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
		case "Brush":
			return (
				<BrushCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
		case "Menu":
			return (
				<MenuCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
		case "Chat":
			return (
				<ChatCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
	}
}
function DefaultCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="100%"
			height="100%"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M20.5056 10.7754C21.1225 10.5355 21.431 10.4155 21.5176 10.2459C21.5926 10.099 21.5903 9.92446 21.5115 9.77954C21.4205 9.61226 21.109 9.50044 20.486 9.2768L4.59629 3.5728C4.0866 3.38983 3.83175 3.29835 3.66514 3.35605C3.52029 3.40621 3.40645 3.52004 3.35629 3.6649C3.29859 3.8315 3.39008 4.08635 3.57304 4.59605L9.277 20.4858C9.50064 21.1088 9.61246 21.4203 9.77973 21.5113C9.92465 21.5901 10.0991 21.5924 10.2461 21.5174C10.4157 21.4308 10.5356 21.1223 10.7756 20.5054L13.3724 13.8278C13.4194 13.707 13.4429 13.6466 13.4792 13.5957C13.5114 13.5506 13.5508 13.5112 13.5959 13.479C13.6468 13.4427 13.7072 13.4192 13.3722 13.3722L20.5056 10.7754Z"
				fill={mainColor}
				stroke={secondaryColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
function BrushCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M8.99997 11.2224L12.7778 15.0002M7.97485 20.975C6.60801 22.3419 4 22.0002 2 22.0002C3.0251 20.0002 1.65827 17.3921 3.0251 16.0253C4.39194 14.6585 6.60801 14.6585 7.97485 16.0253C9.34168 17.3921 9.34168 19.6082 7.97485 20.975ZM11.9216 15.9248L21.0587 6.05671C21.8635 5.18755 21.8375 3.83776 20.9999 3.00017C20.1624 2.16258 18.8126 2.13663 17.9434 2.94141L8.07534 12.0785C7.5654 12.5507 7.31043 12.7868 7.16173 13.0385C6.80514 13.6423 6.79079 14.3887 7.12391 15.0057C7.26283 15.2631 7.50853 15.5088 7.99995 16.0002C8.49136 16.4916 8.73707 16.7373 8.99438 16.8762C9.6114 17.2093 10.3578 17.195 10.9616 16.8384C11.2134 16.6897 11.4494 16.4347 11.9216 15.9248Z"
				fill={mainColor}
				stroke={secondaryColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				transform="rotate(90 12 12)"
			/>
		</svg>
	);
}
function MenuCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M5 18C3.34315 18 2 16.6569 2 15V7.8C2 6.11984 2 5.27976 2.32698 4.63803C2.6146 4.07354 3.07354 3.6146 3.63803 3.32698C4.27976 3 5.11984 3 6.8 3H17.2C18.8802 3 19.7202 3 20.362 3.32698C20.9265 3.6146 21.3854 4.07354 21.673 4.63803C22 5.27976 22 6.11984 22 7.8V15C22 16.6569 20.6569 18 19 18M8.70803 21H15.292C15.8368 21 16.1093 21 16.2467 20.8889C16.3663 20.7923 16.4347 20.6461 16.4324 20.4925C16.4298 20.3157 16.2554 20.1064 15.9065 19.6879L12.6146 15.7375C12.4035 15.4842 12.298 15.3576 12.1716 15.3114C12.0608 15.2709 11.9392 15.2709 11.8284 15.3114C11.702 15.3576 11.5965 15.4842 11.3854 15.7375L8.09346 19.6879C7.74465 20.1064 7.57024 20.3157 7.56758 20.4925C7.56526 20.6461 7.63373 20.7923 7.75326 20.8889C7.89075 21 8.16318 21 8.70803 21Z"
				fill={mainColor}
				stroke={secondaryColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
function ChatCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M7 8.5H12M7 12H15M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z"
				fill={mainColor}
				stroke={secondaryColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
