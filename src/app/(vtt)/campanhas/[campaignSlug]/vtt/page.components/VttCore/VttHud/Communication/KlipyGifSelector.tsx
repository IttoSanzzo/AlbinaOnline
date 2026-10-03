import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./KlipyGifSelector.module.css";
import { setVttElementHoverInteraction } from "../../../Utils/ElementDataAttributeUtils";
import { VttCursorInteractionType } from "../../../Types/VttMouseState";
import {
	Dispatch,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { HookedForm } from "@/libs/stp@forms";
import { useForm, UseFormReturn } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LintIgnoredAny } from "@/libs/stp@types";
import { UIBasics } from "@/components/(UIBasics)";

const KlipyGifSelectorContainer = newStyledElement.div(
	styles.klipyGifSelectorContainer,
);
const OpenGifSelectorButton = newStyledElement.div(
	styles.openGifSelectorButton,
);
const FormHeaderContainer = newStyledElement.div(styles.formHeaderContainer);
const KlipyLogoContainer = newStyledElement.div(styles.klipyLogoContainer);
const FormContentContainer = newStyledElement.div(styles.formContentContainer);
const GifSelectionButton = newStyledElement.button(styles.gifSelectionButton);

const schema = z.object({
	query: z.string(),
});
type FormData = z.infer<typeof schema>;

interface GifData {
	url: string;
	width: number;
	height: number;
}

interface KlipyGifSelectorProps {
	isGifSelectorOpenState: [boolean, Dispatch<SetStateAction<boolean>>];
	chatForm: UseFormReturn<LintIgnoredAny, LintIgnoredAny, LintIgnoredAny>;
	submitChatHandler: (data: LintIgnoredAny) => Promise<void>;
	chatInputRef: RefObject<HTMLTextAreaElement | null>;
}

export function KlipyGifSelector({
	isGifSelectorOpenState: [isGifSelectorOpen, setIsGifSelectorOpen],
	chatForm,
	submitChatHandler,
	chatInputRef,
}: KlipyGifSelectorProps) {
	const selectorRef = useRef<HTMLDivElement>(null);

	const [gifs, setGifs] = useState<GifData[]>([]);

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		mode: "all",
		defaultValues: { query: "" },
	});

	function closeGifSelector() {
		form.reset();
		setIsGifSelectorOpen(false);
	}

	useEffect(() => {
		if (!isGifSelectorOpen) {
			if (gifs.length > 0) setGifs([]);
			return;
		}

		(async () => {
			const response = await fetch(`/api/proxy/klipy?query=anime`);
			if (!response.ok) return;
			setGifs(await response.json());
		})();
	}, [isGifSelectorOpen]);

	useEffect(() => {
		if (!isGifSelectorOpen) return;

		function handlePointerDown(event: PointerEvent) {
			if (
				selectorRef.current &&
				!selectorRef.current.contains(event.target as Node)
			)
				closeGifSelector();
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (
				!event.repeat &&
				((event.ctrlKey && event.key.toLowerCase() === "g") ||
					event.code == "Escape")
			) {
				event.preventDefault();
				closeGifSelector();
				if (chatInputRef.current) chatInputRef.current.focus();
			}
		}

		document.addEventListener("pointerdown", handlePointerDown);
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isGifSelectorOpen]);

	async function handleSubmit(data: FormData) {
		if (isGifSelectorOpen == false) return;

		const query = data.query.trim() || "anime";

		const response = await fetch(
			`/api/proxy/klipy?query=${encodeURIComponent(query)}`,
		);

		if (!response.ok) return;

		setGifs(await response.json());
	}

	function handleGifSelection(link: string) {
		const chatMessage: string = chatForm.getValues("message").trim();

		chatForm.setValue(
			"message",
			chatMessage.length > 0 ? `${chatMessage} ${link}` : link,
		);

		chatForm.handleSubmit(submitChatHandler)();
		closeGifSelector();
	}

	return (
		<KlipyGifSelectorContainer ref={selectorRef}>
			<OpenGifSelectorButton
				{...setVttElementHoverInteraction(VttCursorInteractionType.Pointer)}
				onClick={() => {
					form.reset();
					setIsGifSelectorOpen(!isGifSelectorOpen);
				}}>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg">
					<path
						fill="currentColor"
						d="M18.75,3.50054297 C20.5449254,3.50054297 22,4.95561754 22,6.75054297 L22,17.2531195 C22,19.048045 20.5449254,20.5031195 18.75,20.5031195 L5.25,20.5031195 C3.45507456,20.5031195 2,19.048045 2,17.2531195 L2,6.75054297 C2,4.95561754 3.45507456,3.50054297 5.25,3.50054297 L18.75,3.50054297 Z M8.01459972,8.87193666 C6.38839145,8.87193666 5.26103525,10.2816525 5.26103525,11.9943017 C5.26103525,13.707564 6.38857781,15.1202789 8.01459972,15.1202789 C8.90237918,15.1202789 9.71768065,14.6931811 10.1262731,13.9063503 L10.2024697,13.7442077 L10.226,13.674543 L10.2440163,13.5999276 L10.2440163,13.5999276 L10.2516169,13.5169334 L10.2518215,11.9961937 L10.2450448,11.9038358 C10.2053646,11.6359388 9.99569349,11.4234501 9.72919932,11.3795378 L9.62682145,11.3711937 L8.62521827,11.3711937 L8.53286035,11.3779703 C8.26496328,11.4176506 8.05247466,11.6273217 8.00856234,11.8938159 L8.00021827,11.9961937 L8.00699487,12.0885517 C8.0466751,12.3564488 8.25634623,12.5689373 8.5228404,12.6128497 L8.62521827,12.6211937 L9.00103525,12.6209367 L9.00103525,13.3549367 L8.99484486,13.3695045 C8.80607251,13.6904125 8.44322427,13.8702789 8.01459972,13.8702789 C7.14873038,13.8702789 6.51103525,13.0713017 6.51103525,11.9943017 C6.51103525,10.9182985 7.14788947,10.1219367 8.01459972,10.1219367 C8.43601415,10.1219367 8.67582824,10.1681491 8.97565738,10.3121334 C9.28681641,10.4615586 9.6601937,10.3304474 9.80961888,10.0192884 C9.95904407,9.70812933 9.82793289,9.33475204 9.51677386,9.18532686 C9.03352891,8.95326234 8.61149825,8.87193666 8.01459972,8.87193666 Z M12.6289445,8.99393497 C12.3151463,8.99393497 12.0553614,9.22519285 12.0107211,9.52657705 L12.0039445,9.61893497 L12.0039445,14.381065 L12.0107211,14.4734229 C12.0553613,14.7748072 12.3151463,15.006065 12.6289445,15.006065 C12.9427427,15.006065 13.2025276,14.7748072 13.2471679,14.4734229 L13.2539445,14.381065 L13.2539445,9.61893497 L13.2471679,9.52657705 C13.2025276,9.22519285 12.9427427,8.99393485 12.6289445,8.99393497 Z M17.6221579,9.00083497 L15.6247564,8.99393111 C15.3109601,8.99285493 15.0503782,9.22321481 15.0046948,9.52444312 L14.9975984,9.61677709 L14.9975984,14.3649711 L15.0043751,14.4573291 C15.0440553,14.7252265 15.2537265,14.937714 15.5202206,14.9816271 L15.6225985,14.9899711 L15.7149564,14.9831945 C15.9828535,14.9435143 16.1953421,14.7338432 16.2392544,14.467349 L16.2475985,14.3649711 L16.2470353,13.2499367 L17.37,13.2504012 L17.4623579,13.2436246 C17.730255,13.2039444 17.9427439,12.9942732 17.9866559,12.7277791 L17.995,12.6254012 L17.9882234,12.5330433 C17.9485432,12.2651462 17.738872,12.0526576 17.4723779,12.0087453 L17.37,12.0004012 L16.2470353,11.9999367 L16.2470353,10.2449367 L17.6178421,10.2508313 L17.7102229,10.2443727 C18.0117595,10.2007704 18.2439139,9.94178541 18.2450039,9.62798912 C18.24608,9.31419285 18.0157202,9.05361096 17.7144919,9.00793041 L17.6221579,9.00083497 L15.6247564,8.99393111 L17.6221579,9.00083497 Z"
					/>
				</svg>
			</OpenGifSelectorButton>
			{isGifSelectorOpen && (
				<HookedForm.Form<FormData>
					form={form}
					onSubmit={handleSubmit}
					onChangeAction={handleSubmit}
					actionDebounceMs={300}
					className={styles.form}>
					<FormHeaderContainer>
						<KlipyLogo />
						<HookedForm.TextInput<FormData>
							fieldName="query"
							label={""}
							placeholder={"Search KLIPY"}
							autoFocus
						/>
					</FormHeaderContainer>
					<FormContentContainer tabIndex={-1}>
						<UIBasics.List.Grid
							withoutPadding
							withoutBorder
							withoutMargin
							columns={2}
							direction={"masonry"}
							children={gifs.map((gif) => (
								<GifSelectionButton
									key={gif.url}
									style={{
										aspectRatio: `${gif.width} / ${gif.height}`,
									}}
									{...setVttElementHoverInteraction(
										VttCursorInteractionType.Pointer,
									)}
									onClick={() => handleGifSelection(gif.url)}
									onKeyDown={(event) => {
										if (event.code != "Enter") return;
										event.preventDefault();
										handleGifSelection(gif.url);
									}}>
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={gif.url}
										onLoad={(event) => {
											event.currentTarget.dataset.loaded = "true";
										}}
									/>
								</GifSelectionButton>
							))}
						/>
					</FormContentContainer>
				</HookedForm.Form>
			)}
		</KlipyGifSelectorContainer>
	);
}

export function KlipyLogo() {
	return (
		<KlipyLogoContainer>
			<svg
				viewBox="0 0 2335.63 396.67"
				xmlns="http://www.w3.org/2000/svg">
				<g>
					<g>
						<path
							fill="#6d6d6d"
							d="M82.4,203.22c7.32,7.05,10.99,16.84,10.99,29.38,0,8.32-1.69,15.48-5.08,21.47-3.39,5.99-8.1,10.54-14.15,13.65-6.05,3.11-13.01,4.66-20.89,4.66h-28.63v44.78H0v-124.51h53.27c12.09,0,21.81,3.52,29.13,10.57ZM50.27,250.58c5.21,0,9.51-1.58,12.9-4.74,3.38-3.16,5.08-7.57,5.08-13.23s-1.69-10.24-5.08-13.4c-3.39-3.16-7.69-4.74-12.9-4.74h-25.63v36.12h25.63Z"
						/>
						<path
							fill="#6d6d6d"
							d="M207.16,198.81c9.71,5.22,17.34,12.65,22.89,22.31,5.55,9.65,8.32,20.92,8.32,33.79s-2.78,24.14-8.32,33.79c-5.55,9.65-13.18,17.09-22.89,22.31-9.71,5.22-20.72,7.82-33.04,7.82s-23.55-2.61-33.38-7.82c-9.82-5.21-17.51-12.65-23.05-22.31-5.55-9.65-8.32-20.92-8.32-33.79s2.77-24.14,8.32-33.79c5.55-9.65,13.23-17.09,23.05-22.31,9.82-5.21,20.95-7.82,33.38-7.82s23.33,2.61,33.04,7.82ZM139.66,277.38c3.33,6.33,7.96,11.18,13.9,14.56,5.94,3.39,12.79,5.08,20.56,5.08s14.45-1.69,20.39-5.08c5.94-3.38,10.54-8.24,13.82-14.56,3.27-6.33,4.91-13.82,4.91-22.47s-1.64-16.15-4.91-22.47c-3.27-6.33-7.88-11.18-13.82-14.56-5.94-3.38-12.73-5.08-20.39-5.08s-14.62,1.69-20.56,5.08c-5.94,3.39-10.57,8.24-13.9,14.56-3.33,6.33-4.99,13.82-4.99,22.47s1.66,16.15,4.99,22.47Z"
						/>
						<path
							fill="#6d6d6d"
							d="M339.91,235.93l-27.13,81.23h-20.81l-43.45-124.51h27.13l26.97,83.56,27.13-83.56h20.31l27.13,83.56,27.13-83.56h26.97l-43.45,124.51h-20.81l-27.13-81.23Z"
						/>
						<path
							fill="#6d6d6d"
							d="M474.24,242.59h47.61v21.47h-47.61v31.13h54.93v21.97h-79.57v-124.51h79.4v21.81h-54.77v28.13Z"
						/>
						<path
							fill="#6d6d6d"
							d="M552.98,192.65h52.6c11.99,0,21.64,3.5,28.96,10.49s10.99,16.7,10.99,29.13c0,8.55-1.78,15.84-5.33,21.89-3.55,6.05-8.55,10.57-14.98,13.57l26.97,49.44h-27.97l-24.64-45.28h-21.97v45.28h-24.64v-124.51ZM602.58,250.08c5.33,0,9.65-1.55,12.98-4.66,3.33-3.11,4.99-7.49,4.99-13.15s-1.66-10.04-4.99-13.15c-3.33-3.11-7.66-4.66-12.98-4.66h-24.97v35.62h24.97Z"
						/>
						<path
							fill="#6d6d6d"
							d="M698.3,242.59h47.61v21.47h-47.61v31.13h54.93v21.97h-79.57v-124.51h79.4v21.81h-54.77v28.13Z"
						/>
						<path
							fill="#6d6d6d"
							d="M859.6,200.14c9.32,4.99,16.65,12.18,21.97,21.56,5.33,9.38,7.99,20.45,7.99,33.21s-2.66,23.83-7.99,33.21c-5.33,9.38-12.68,16.56-22.06,21.56-9.38,4.99-19.95,7.49-31.71,7.49h-50.77v-124.51h50.94c11.76,0,22.31,2.5,31.63,7.49ZM827.97,295.85c11.43,0,20.47-3.5,27.13-10.49,6.66-6.99,9.99-17.15,9.99-30.46s-3.3-23.47-9.9-30.46c-6.6-6.99-15.62-10.49-27.05-10.49h-26.47v81.9h26.3Z"
						/>
						<path
							fill="#6d6d6d"
							d="M1031.3,201.39c7.05,5.83,10.57,14.4,10.57,25.72,0,5.66-1.06,10.52-3.16,14.57-2.11,4.05-4.88,7.41-8.32,10.07,4.66,2.11,8.57,5.69,11.74,10.74,3.16,5.05,4.74,11.24,4.74,18.56,0,11.65-3.64,20.59-10.9,26.8-7.27,6.22-16.95,9.32-29.05,9.32h-55.26v-124.51h51.44c11.76,0,21.17,2.91,28.21,8.74ZM1001.92,242.92c4.55,0,8.13-1.14,10.74-3.41,2.61-2.27,3.91-5.8,3.91-10.57s-1.44-8.38-4.33-10.82c-2.89-2.44-6.88-3.66-11.99-3.66h-23.97v28.46h25.63ZM1003.92,295.19c5.44,0,9.76-1.27,12.98-3.83,3.22-2.55,4.83-6.43,4.83-11.65s-1.58-9.26-4.74-11.82c-3.16-2.55-7.35-3.83-12.57-3.83h-28.13v31.13h27.63Z"
						/>
						<path
							fill="#6d6d6d"
							d="M1104.29,317.16v-48.27l-47.27-76.24h28.63l30.96,51.77,30.8-51.77h28.63l-47.11,76.24v48.27h-24.64Z"
						/>
					</g>

					<g>
						<rect
							fill="#6d6d6d"
							x="1742.19"
							y="111.85"
							width="85.35"
							height="284.82"
							rx="4.27"
							ry="4.27"
						/>
						<path
							fill="#6d6d6d"
							d="M1603.91,309.45V124.2c0-6.82-5.53-12.36-12.36-12.36h-60.64c-6.82,0-12.36,5.53-12.36,12.36v260.11c0,6.82,5.53,12.36,12.36,12.36h180.82c6.82,0,12.36-5.53,12.36-12.36v-50.15c0-6.82-5.53-12.36-12.36-12.36h-95.46c-6.82,0-12.36-5.53-12.36-12.36Z"
						/>
						<path
							fill="#6d6d6d"
							d="M1964.12,111.82c-3.2,0-9.84.03-10.02.03h-29.97s-66.71,0-66.71,0c-6.82,0-12.36,5.53-12.36,12.36v260.11c0,6.82,5.53,12.36,12.36,12.36h60.64c6.82,0,12.36-5.53,12.36-12.36v-71.89c0-2.18,2.09-3.79,4.18-3.17,30.52,8.94,70.45,9.83,104.71-24.43,72.96-72.96,3.73-173.01-75.18-173.01ZM1985.45,236.59c-32.47,22.93-68.34-12.95-45.41-45.41.75-1.06,1.69-2,2.75-2.75,32.47-22.93,68.34,12.94,45.41,45.41-.75,1.06-1.69,2-2.75,2.75Z"
						/>
						<path
							fill="#6d6d6d"
							d="M2332.11,156.92l-41.66-41.66c-4.69-4.69-12.29-4.69-16.97,0l-66.55,66.55c-1.84,1.84-4.83,1.84-6.67,0l-66.55-66.55c-4.69-4.69-12.29-4.69-16.97,0l-41.66,41.66c-4.69,4.69-4.69,12.29,0,16.97l85.61,85.61c.93.93,1.45,2.19,1.45,3.5v121.66c0,6.63,5.37,12,12,12h58.91c6.63,0,12-5.37,12-12v-121.66c0-1.31.52-2.57,1.45-3.5l85.61-85.61c4.69-4.69,4.69-12.29,0-16.97Z"
						/>

						<g>
							<g>
								<path
									fill="#6d6d6d"
									d="M1496.99,385.59l-83.53-128.94c-1.49-2.3-1.53-5.25-.08-7.63l78.43-129.01c2.91-4.83-.54-11-6.17-11l-49.54,11.23c-39.39,8.89-51.04,31.84-74.64,64.6-4.64,6.44-7.63,10.81-7.63,10.81-3.6,6.59-13.56,4.02-13.56-3.41v-106.37c-30.04,0-45.75,10.96-57.97,21.04-37.59,31.04-45.83,69.51-45.83,118.4v164.15c0,3.98,3.22,7.2,7.2,7.2h89.43c3.95,0,7.17-3.22,7.17-7.2v-81.84c0-7.32,9.62-9.96,13.37-3.72l30.5,89.28c1.3,2.18,3.68,3.49,6.17,3.49h100.62c5.75.04,9.2-6.28,6.05-11.07ZM1319.78,123.51c-5.4,0-9.81-4.41-9.81-9.81s4.41-9.77,9.81-9.77,9.77,4.37,9.77,9.77-4.37,9.81-9.77,9.81Z"
								/>
								<path
									fill="#6d6d6d"
									d="M1223.83,180.64c.8,2.11,7.78-109.85,117.36-110.93,0,0-88.93-104.18-121.85-57.82,0,0-16.32,25.6,15.17,33.45,0,0-50.73,13.26-49.7,48.59.34,11.04,11.53,18.16,21.65,13.76,5.86-2.57,13.33-7.59,22.72-16.48.04-.04-22.19,44.6-5.36,89.43Z"
								/>
							</g>
							<path
								fill="#6d6d6d"
								d="M1352.46,90.36v27.17c0,1.95,2.15,3.1,3.76,2.03l25.94-17.24-26.13-14.06c-1.61-.88-3.56.27-3.56,2.11Z"
							/>
						</g>
					</g>
				</g>
			</svg>
		</KlipyLogoContainer>
	);
}
