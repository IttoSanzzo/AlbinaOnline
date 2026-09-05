import { VttInteractionType } from "../../Types/VttMouseState";
import styles from "./CursorSvg.module.css";

interface CursorIconProps {
	type?: VttInteractionType;
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
		case "Move":
			return (
				<MoveCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
		case "Eraser":
			return (
				<EraserCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
		case "Hand":
			return (
				<HandCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
		case "Measuring":
			return (
				<MeasuringCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
		case "DefaultUp":
			return (
				<DefaultUpCursorSvg
					mainColor={mainColor}
					secondaryColor={secondaryColor}
				/>
			);
		case "Pointer":
			return (
				<PointerCursorSvg
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
function DefaultUpCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="100%"
			height="100%"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M5.03685 21.3253C4.45216 21.5826 4.15982 21.7112 3.98042 21.6547C3.8249 21.6057 3.70303 21.484 3.65387 21.3285C3.59717 21.1492 3.72545 20.8567 3.98203 20.2717L11.2634 3.6702C11.495 3.14212 11.6108 2.87808 11.7727 2.79727C11.9133 2.72708 12.0787 2.72708 12.2193 2.79727C12.3812 2.87808 12.497 3.14212 12.7287 3.6702L20.01 20.2717C20.2666 20.8567 20.3949 21.1492 20.3382 21.3285C20.289 21.484 20.1671 21.6057 20.0116 21.6547C19.8322 21.7112 19.5399 21.5826 18.9552 21.3253L12.3182 18.405C12.1995 18.3528 12.1402 18.3267 12.0785 18.3164C12.0239 18.3072 11.9681 18.3072 11.9135 18.3164C11.8519 18.3267 11.7925 18.3528 11.6738 18.405L5.03685 21.3253Z"
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
function MoveCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M5 9L2 12M2 12L5 15M2 12H22M9 5L12 2M12 2L15 5M12 2V22M15 19L12 22M12 22L9 19M19 9L22 12M22 12L19 15"
				fill={secondaryColor}
				stroke={mainColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
function EraserCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M17.9995 13L10.9995 6.00004M20.9995 21H7.99955M10.9368 20.0628L19.6054 11.3941C20.7935 10.2061 21.3875 9.61207 21.6101 8.92709C21.8058 8.32456 21.8058 7.67551 21.6101 7.07298C21.3875 6.388 20.7935 5.79397 19.6054 4.60592L19.3937 4.39415C18.2056 3.2061 17.6116 2.61207 16.9266 2.38951C16.3241 2.19373 15.675 2.19373 15.0725 2.38951C14.3875 2.61207 13.7935 3.2061 12.6054 4.39415L4.39366 12.6059C3.20561 13.794 2.61158 14.388 2.38902 15.073C2.19324 15.6755 2.19324 16.3246 2.38902 16.9271C2.61158 17.6121 3.20561 18.2061 4.39366 19.3941L5.06229 20.0628C5.40819 20.4087 5.58114 20.5816 5.78298 20.7053C5.96192 20.815 6.15701 20.8958 6.36108 20.9448C6.59126 21 6.83585 21 7.32503 21H8.67406C9.16324 21 9.40784 21 9.63801 20.9448C9.84208 20.8958 10.0372 20.815 10.2161 20.7053C10.418 20.5816 10.5909 20.4087 10.9368 20.0628Z"
				fill={mainColor}
				stroke={secondaryColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				transform="rotate(270 12 12)"
			/>
		</svg>
	);
}
function HandCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M6.9 11.4444V14.2222M6.9 11.4444V4.77778C6.9 3.8573 7.66112 3.11111 8.6 3.11111C9.53888 3.11111 10.3 3.8573 10.3 4.77778M6.9 11.4444C6.9 10.524 6.13888 9.77778 5.2 9.77778C4.26112 9.77778 3.5 10.524 3.5 11.4444V13.6667C3.5 18.269 7.30558 22 12 22C16.6944 22 20.5 18.269 20.5 13.6667V8.11111C20.5 7.19064 19.7389 6.44444 18.8 6.44444C17.8611 6.44444 17.1 7.19064 17.1 8.11111M10.3 4.77778V10.8889M10.3 4.77778V3.66667C10.3 2.74619 11.0611 2 12 2C12.9389 2 13.7 2.74619 13.7 3.66667V4.77778M13.7 4.77778V10.8889M13.7 4.77778C13.7 3.8573 14.4611 3.11111 15.4 3.11111C16.3389 3.11111 17.1 3.8573 17.1 4.77778V8.11111M17.1 8.11111V10.8889"
				fill={mainColor}
				stroke={secondaryColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
function MeasuringCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M14.5 5.49989L16 6.99989M11.5 8.49989L13 9.99989M8.49996 11.4999L9.99996 12.9999M5.49996 14.4999L6.99996 15.9999M2.56561 17.5656L6.43424 21.4342C6.63225 21.6322 6.73125 21.7313 6.84542 21.7683C6.94584 21.801 7.05401 21.801 7.15443 21.7683C7.2686 21.7313 7.3676 21.6322 7.56561 21.4342L21.4342 7.56561C21.6322 7.3676 21.7313 7.2686 21.7683 7.15443C21.801 7.05401 21.801 6.94584 21.7683 6.84542C21.7313 6.73125 21.6322 6.63225 21.4342 6.43424L17.5656 2.56561C17.3676 2.3676 17.2686 2.2686 17.1544 2.2315C17.054 2.19887 16.9458 2.19887 16.8454 2.2315C16.7313 2.2686 16.6322 2.3676 16.4342 2.56561L2.56561 16.4342C2.3676 16.6322 2.2686 16.7313 2.2315 16.8454C2.19887 16.9458 2.19887 17.054 2.2315 17.1544C2.2686 17.2686 2.3676 17.3676 2.56561 17.5656Z"
				fill={mainColor}
				stroke={secondaryColor}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				transform="rotate(270 12 12)"
			/>
		</svg>
	);
}
function PointerCursorSvg({ mainColor, secondaryColor }: CursorIconProps) {
	return (
		<svg
			className={styles.cursorIcon}
			width="24"
			height="24"
			viewBox="0 0 48 48"
			fill="none"
			xmlns="http://www.w3.org/2000/svg">
			<path
				d="M38.1,16.1a4.8,4.8,0,0,0-2.7.2A4.9,4.9,0,0,0,31.2,14l-1.3.2A4.8,4.8,0,0,0,25.4,11h-1V7.2a5,5,0,0,0-5.8-5.1,5.1,5.1,0,0,0-4,5V21.9l-2.4-2.4A4.9,4.9,0,0,0,8.7,18a4.6,4.6,0,0,0-3.4,1.5,4.1,4.1,0,0,0-1.3,3,7.9,7.9,0,0,0,1.3,4C6.5,28.7,13.8,41.3,16,45a1.9,1.9,0,0,0,1.7,1H36.5a2,2,0,0,0,2-1.5l3.4-13.2a1.3,1.3,0,0,0,.1-.6V21.2A5.2,5.2,0,0,0,38.1,16.1ZM35.1,42H18.8c-2.7-4.5-9-15.5-10.1-17.5-.1-.2-1.1-1.8-.7-2.2l.7-.3a1.1,1.1,0,0,1,.7.3l5.8,6a2,2,0,0,0,3.3-1.4V7a1,1,0,0,1,2,0V21a1.9,1.9,0,0,0,1.9,2h0a2,2,0,0,0,2-2V16a1,1,0,0,1,1-1,1,1,0,0,1,.9,1v6a2,2,0,0,0,2,2h0a2,2,0,0,0,2-2V19a.9.9,0,0,1,1,1v5a2,2,0,0,0,2,2h0a1.9,1.9,0,0,0,1.9-2V21a1,1,0,0,1,2,0v9.5a1.3,1.3,0,0,1-.1.6Z"
				fill={mainColor}
				stroke={secondaryColor}
				strokeWidth="4"
				strokeLinejoin="round"
				paintOrder="stroke fill"
			/>
		</svg>
	);
}
