import { CSSProperties, useRef, useState } from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import * as NextImage from "next/image";
import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { useHookedForm } from "../../context/HookedFormContext";
import Cropper from "react-easy-crop";
import { LintIgnoredAny } from "@/libs/stp@types";
import { parseGIF, decompressFrames } from "gifuct-js";
import { encode, UnencodedFrame } from "modern-gif";

const ImageInputContainer = newStyledElement.div(styles.imageInputContainer);
const ImageInputField = newStyledElement.input(styles.imageInputField);
const ImageInputLabel = newStyledElement.label(styles.imageInputLabel);
const ImageInputError = newStyledElement.div(styles.imageInputError);
const ImagePreviewContainer = newStyledElement.div(
	styles.imagePreviewContainer,
);

type ImageInputProps<TFormData> = {
	fieldName: Path<TFormData>;
	label: string;
	labelBackground?: keyof typeof StandartBackgroundColor;
	accept?: string;
	previewMaxWidth?: CSSProperties["maxWidth"];
	previewMaxHeight?: CSSProperties["maxHeight"];
	maxWidth?: number;
	maxHeight?: number;
	minWidth?: number;
	minHeight?: number;
	proportion?: number;
	maxSize?: number;
	multiple?: boolean;
	maxFiles?: number;
	displayPreview?: boolean;
	croppingProportions?: [number, number];
};
export function ImageInput<TFormData extends FieldValues>({
	fieldName,
	label,
	labelBackground,
	accept = "image/*",
	previewMaxWidth,
	previewMaxHeight,
	maxWidth,
	maxHeight,
	minWidth,
	minHeight,
	proportion,
	maxSize = 1_048_576,
	multiple = false,
	maxFiles,
	displayPreview = true,
	croppingProportions,
}: ImageInputProps<TFormData>) {
	const onChangeRef = useRef<(file: File) => void>(null);
	const cropTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormData>();
	const [originalFile, setOriginalFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const inputStyle: CSSProperties = {};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
	};

	if (multiple) croppingProportions = undefined;

	async function validateInput(data: File[]): Promise<string | null> {
		if (maxFiles != undefined && data.length > maxFiles)
			return `Limite de ${maxFiles} arquivos excedido.`;
		for (const file of data) {
			if (!file.type.startsWith("image/")) return "Arquivo não é imagem";
			if (maxSize && file.size > maxSize)
				return `Imagem excede o tamanho máximo de ${(
					maxSize /
					1024 /
					1024
				).toFixed(2)}MB`;
			const img = await fileToImage(file);
			if (minWidth && img.width < minWidth)
				return `Menor que largura mínima de ${minWidth}px`;
			if (maxWidth && img.width > maxWidth)
				return `Excede largura máxima de ${maxWidth}px`;
			if (minHeight && img.height < minHeight)
				return `Menor que altura mínima de ${maxHeight}px`;
			if (maxHeight && img.height > maxHeight)
				return `Excede altura máxima de ${maxHeight}px`;

			if (proportion) {
				const actualRatio = img.width / img.height;
				const diff = Math.abs(actualRatio - proportion);
				if (diff > 0.01)
					return `Proporção esperada: ${proportion}, mas a imagem tem ${actualRatio.toFixed(
						2,
					)}`;
			}
		}
		return null;
	}

	const handleCrop = async (
		_: LintIgnoredAny,
		croppedAreaPixels: LintIgnoredAny,
	) => {
		if (cropTimeoutRef.current) clearTimeout(cropTimeoutRef.current);
		onChangeRef.current?.(null!);
		if (originalFile == null) {
			setError("missing originalFile...");
			onChangeRef.current?.(null!);
			return;
		}
		const mimeType = originalFile!.type || "image/png";
		const extension = mimeType.split("/")[1] ?? "png";
		cropTimeoutRef.current = setTimeout(
			async () => {
				if (originalFile == null) {
					setError("missing originalFile...");
					onChangeRef.current?.(null!);
					return;
				}
				const file = await getCroppedFile(
					originalFile,
					preview!,
					croppedAreaPixels,
					mimeType,
					extension,
				);
				const err = await validateInput([file]);
				if (err) {
					setError(err);
					onChangeRef.current?.(null!);
				} else {
					setError(null);
					onChangeRef.current?.(file);
				}
			},
			mimeType === "image/gif" ? 1000 : 500,
		);
	};

	return (
		<ImageInputContainer>
			<ImageInputLabel
				children={label}
				style={labelStyle}
			/>
			{error && <ImageInputError>{error}</ImageInputError>}
			{preview == null ? null : !croppingProportions ? (
				<ImagePreviewContainer>
					<NextImage.default
						style={{
							maxWidth: previewMaxWidth ?? "100%",
							maxHeight: previewMaxHeight ?? "100%",
							width: "auto",
							height: "auto",
							objectFit: "cover",
						}}
						src={preview}
						alt={"..."}
						width={0}
						height={0}
						sizes="(max-width: 100%)"
						fill={false}
						quality={100}
					/>
				</ImagePreviewContainer>
			) : (
				<ImagePreviewContainer
					style={{
						aspectRatio: "1/1",
					}}>
					<Cropper
						style={{
							containerStyle: {
								maxWidth: previewMaxWidth ?? "100%",
								maxHeight: previewMaxHeight ?? "100%",
							},
						}}
						image={preview!}
						crop={crop}
						zoom={zoom}
						aspect={croppingProportions![0] / croppingProportions![1]}
						onCropChange={setCrop}
						onZoomChange={setZoom}
						onCropComplete={handleCrop}
					/>
				</ImagePreviewContainer>
			)}
			<Controller
				name={fieldName}
				control={control}
				defaultValue={null!}
				render={({ field }) => {
					onChangeRef.current = field.onChange;
					return (
						<ImageInputField
							type="file"
							multiple={multiple}
							accept={accept}
							style={inputStyle}
							onChange={async (event) => {
								const data: File[] = Array.from(event.target.files ?? []);
								if (data == null) return;

								if (!croppingProportions) {
									const err = await validateInput(data);
									if (err) {
										setError(err);
										field.onChange(null);
										setPreview(null);
										return;
									}
									setError(null);
								}

								if ((displayPreview || croppingProportions) && data.length == 1)
									setPreview(URL.createObjectURL(data[0]));
								else setPreview(null);

								if (multiple) field.onChange(data);
								else if (croppingProportions) {
									field.onChange(null!);
									setOriginalFile(data[0]);
								} else field.onChange(data[0]);

								triggerDebounceAction();
							}}
						/>
					);
				}}
			/>
		</ImageInputContainer>
	);
}

async function fileToImage(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = function (e) {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			if (e.target?.result) {
				img.src = e.target.result as string;
			}
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

function createImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = url;
	});
}

async function getCroppedFile(
	file: File,
	imageSrc: string,
	crop: LintIgnoredAny,
	mimeType: string,
	extension: string,
): Promise<File> {
	if (mimeType === "image/gif") return getCroppedGifFile(file, crop);
	return getCroppedStaticFile(imageSrc, crop, mimeType, extension);
}

async function getCroppedStaticFile(
	imageSrc: string,
	crop: LintIgnoredAny,
	mimeType: string,
	extension: string,
): Promise<File> {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Canvas context not available");

	const quality = mimeType === "image/jpeg" ? 0.92 : 1;
	const image = await createImage(imageSrc);

	canvas.width = crop.width;
	canvas.height = crop.height;

	ctx.drawImage(
		image,
		crop.x,
		crop.y,
		crop.width,
		crop.height,
		0,
		0,
		crop.width,
		crop.height,
	);

	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) return reject(new Error("Canvas toBlob failed"));

				resolve(new File([blob], `cropped.${extension}`, { type: mimeType }));
			},
			mimeType,
			quality,
		);
	});
}

async function getCroppedGifFile(
	file: File,
	crop: LintIgnoredAny,
): Promise<File> {
	const gif = parseGIF(await file.arrayBuffer());
	const frames = decompressFrames(gif, true);

	const width = gif.lsd.width;
	const height = gif.lsd.height;

	const baseCanvas = document.createElement("canvas");
	baseCanvas.width = width;
	baseCanvas.height = height;

	const baseCtx = baseCanvas.getContext("2d");
	if (!baseCtx) throw new Error("Canvas context not available");

	baseCtx.clearRect(0, 0, width, height);

	const outputFrames: UnencodedFrame[] = [];

	for (let index = 0; index < frames.length; ++index) {
		const frame = frames[index];
		const { dims, patch, delay, disposalType } = frame;

		if (index % 2 === 0) await nextFrame();

		let prev: ImageData | null = null;

		if (disposalType === 3) prev = baseCtx.getImageData(0, 0, width, height);

		if (disposalType === 2)
			baseCtx.clearRect(dims.left, dims.top, dims.width, dims.height);

		const frameCanvas = document.createElement("canvas");
		frameCanvas.width = dims.width;
		frameCanvas.height = dims.height;

		const frameCtx = frameCanvas.getContext("2d");
		if (!frameCtx) throw new Error("Frame ctx not available");

		const imageData = new ImageData(
			new Uint8ClampedArray(patch),
			dims.width,
			dims.height,
		);

		frameCtx.putImageData(imageData, 0, 0);

		baseCtx.drawImage(frameCanvas, dims.left, dims.top);

		const cropCanvas = document.createElement("canvas");
		cropCanvas.width = crop.width;
		cropCanvas.height = crop.height;

		const cropCtx = cropCanvas.getContext("2d");
		if (!cropCtx) throw new Error("Crop ctx not available");

		cropCtx.drawImage(
			baseCanvas,
			crop.x,
			crop.y,
			crop.width,
			crop.height,
			0,
			0,
			crop.width,
			crop.height,
		);

		outputFrames.push({
			data: cropCanvas,
			width: crop.width,
			height: crop.height,
			delay: delay,
			disposal: disposalType as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | undefined,
		});

		if (disposalType === 3 && prev) baseCtx.putImageData(prev, 0, 0);
	}

	const gifBuffer = await encode({
		frames: outputFrames,
		width: crop.width,
		height: crop.height,
		format: "arrayBuffer",
	});

	return new File([gifBuffer], "cropped.gif", {
		type: "image/gif",
	});
}

function nextFrame(): Promise<void> {
	return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
