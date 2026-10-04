"use client";

import React, {
	CSSProperties,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
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
import { extractImagesFromDrop } from "./utils";
import { startCase } from "lodash";

const MediaInputContainer = newStyledElement.div(styles.mediaInputContainer);
const MediaInputField = newStyledElement.input(styles.mediaInputField);
const MediaInputLabel = newStyledElement.label(styles.mediaInputLabel);
const MediaInputError = newStyledElement.div(styles.mediaInputError);
const MediaPreviewContainer = newStyledElement.div(
	styles.mediaPreviewContainer,
);

export interface MediaInputHandle {
	setMedia: (media: File | null) => Promise<boolean>;
	setImage: (image: File | null) => Promise<boolean>;
}

type MediaInputProps<TFormData> = {
	fieldName: Path<TFormData>;
	label?: string;
	autoLabelFormatting?: boolean;
	labelBackground?: keyof typeof StandartBackgroundColor;
	mediaTypes?: "image" | "video" | "both";
	GifVideo?: boolean;
	accept?: string;
	previewMaxWidth?: CSSProperties["maxWidth"];
	previewMaxHeight?: CSSProperties["maxHeight"];
	maxWidth?: number;
	maxHeight?: number;
	minWidth?: number;
	minHeight?: number;
	proportion?: number;
	maxSize?: number;
	maxDuration?: number;
	multiple?: boolean;
	maxFiles?: number;
	displayPreview?: boolean;
	croppingProportions?: [number, number];
};

type MediaInputComponent = <TFormData extends FieldValues>(
	props: MediaInputProps<TFormData> & {
		ref?: React.Ref<MediaInputHandle>;
	},
) => React.ReactElement;

const MediaInputInner = <TFormData extends FieldValues>(
	props: MediaInputProps<TFormData>,
	ref: React.Ref<MediaInputHandle>,
) => {
	const {
		fieldName,
		autoLabelFormatting = true,
		label,
		labelBackground,
		mediaTypes = "image",
		GifVideo = false,
		accept,
		previewMaxWidth,
		previewMaxHeight,
		maxWidth,
		maxHeight,
		minWidth,
		minHeight,
		proportion,
		maxSize = 1_048_576,
		maxDuration,
		multiple = false,
		maxFiles,
		displayPreview = true,
	} = props;
	const croppingProportions = multiple ? undefined : props.croppingProportions;
	const defaultLabel =
		mediaTypes === "video"
			? "Video"
			: mediaTypes === "both"
				? "Media"
				: autoLabelFormatting
					? startCase(fieldName)
					: fieldName;
	const displayLabel = label ?? defaultLabel;
	const inputAccept =
		accept ??
		(mediaTypes === "video"
			? "video/*"
			: mediaTypes === "both"
				? "image/*,video/*"
				: "image/*");

	const mediaInputRef = useRef<HTMLInputElement | null>(null);
	const onChangeRef = useRef<(file: File | File[] | null) => void | null>(null);
	const cropTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormData>();
	const [originalFile, setOriginalFile] = useState<File | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);

	const inputStyle: CSSProperties = {};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
	};

	useEffect(() => {
		return () => {
			if (preview) URL.revokeObjectURL(preview);
		};
	}, [preview]);

	const validateInput = useCallback(
		async (data: File[]): Promise<string | null> => {
			if (maxFiles != undefined && data.length > maxFiles)
				return `Limite de ${maxFiles} arquivos excedido.`;

			for (const file of data) {
				const isImage = file.type.startsWith("image/");
				const isVideo = file.type.startsWith("video/");

				if (
					(mediaTypes === "image" && !isImage) ||
					(mediaTypes === "video" && !isVideo) ||
					(mediaTypes === "both" && !isImage && !isVideo)
				)
					return `Arquivo não é ${mediaTypes === "both" ? "imagem ou vídeo" : mediaTypes === "video" ? "vídeo" : "imagem"}`;

				if (maxSize && file.size > maxSize)
					return `${isVideo ? "Vídeo" : "Imagem"} excede o tamanho máximo de ${(
						maxSize /
						1024 /
						1024
					).toFixed(2)}MB`;

				let dimensions: { width: number; height: number };

				if (isImage) {
					dimensions = await fileToImage(file);
				} else {
					const video = await fileToVideo(file);

					if (maxDuration && video.duration > maxDuration)
						return `Vídeo excede a duração máxima de ${maxDuration}s`;

					dimensions = video;
				}

				if (minWidth && dimensions.width < minWidth)
					return `Menor que largura mínima de ${minWidth}px`;

				if (maxWidth && dimensions.width > maxWidth)
					return `Excede largura máxima de ${maxWidth}px`;

				if (minHeight && dimensions.height < minHeight)
					return `Menor que altura mínima de ${minHeight}px`;

				if (maxHeight && dimensions.height > maxHeight)
					return `Excede altura máxima de ${maxHeight}px`;

				if (proportion) {
					const actualRatio = dimensions.width / dimensions.height;
					const diff = Math.abs(actualRatio - proportion);

					if (diff > 0.01)
						return `Proporção esperada: ${proportion}, mas a mídia tem ${actualRatio.toFixed(
							2,
						)}`;
				}
			}

			return null;
		},
		[
			maxFiles,
			maxSize,
			maxDuration,
			minWidth,
			maxWidth,
			minHeight,
			maxHeight,
			proportion,
			mediaTypes,
		],
	);

	const handleCrop = async (
		_: LintIgnoredAny,
		croppedAreaPixels: LintIgnoredAny,
	) => {
		if (cropTimeoutRef.current) clearTimeout(cropTimeoutRef.current);
		onChangeRef.current?.(null);

		if (originalFile == null) {
			setError("missing originalFile...");
			onChangeRef.current?.(null);
			return;
		}

		const mimeType = originalFile!.type || "image/png";
		const extension = mimeType.split("/")[1] ?? "png";

		cropTimeoutRef.current = setTimeout(
			async () => {
				if (originalFile == null) {
					setError("missing originalFile...");
					onChangeRef.current?.(null);
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
					onChangeRef.current?.(null);
				} else {
					setError(null);
					onChangeRef.current?.(file);
				}
			},
			mimeType === "image/gif" ? 1000 : 500,
		);
	};

	const handleFiles = useCallback(
		async (data: File[]): Promise<boolean> => {
			if (!onChangeRef.current || data == null) return false;

			const dt = new DataTransfer();
			data.forEach((f) => dt.items.add(f));

			if (mediaInputRef.current) mediaInputRef.current.files = dt.files;

			const shouldCrop =
				croppingProportions &&
				data.length === 1 &&
				data[0].type.startsWith("image/");

			if (!shouldCrop) {
				const err = await validateInput(data);

				if (err) {
					setError(err);
					onChangeRef.current(null);
					setPreview(null);
					setSelectedFile(null);
					return false;
				}

				setError(null);
			}

			if ((displayPreview || shouldCrop) && data.length == 1) {
				setPreview(URL.createObjectURL(data[0]));
				setSelectedFile(data[0]);
			} else {
				setPreview(null);
				setSelectedFile(null);
			}

			if (multiple) {
				onChangeRef.current(data);
			} else if (shouldCrop) {
				onChangeRef.current(null);
				setOriginalFile(data[0]);
			} else {
				onChangeRef.current(data[0]);
			}

			triggerDebounceAction();
			return true;
		},
		[
			croppingProportions,
			validateInput,
			displayPreview,
			triggerDebounceAction,
			multiple,
		],
	);

	useImperativeHandle(
		ref,
		() => ({
			setMedia: async (media: File | null): Promise<boolean> => {
				if (media == null) return false;
				return await handleFiles([media]);
			},
			setImage: async (image: File | null): Promise<boolean> => {
				if (image == null) return false;
				return await handleFiles([image]);
			},
		}),
		[handleFiles],
	);

	const previewIsVideo = selectedFile?.type.startsWith("video/") ?? false;

	return (
		<MediaInputContainer
			style={
				isDragging
					? {
							border: "1px solid var(--cl-blue-500)",
						}
					: undefined
			}
			onDragEnter={(e) => {
				e.preventDefault();
				setIsDragging(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				const toElement = e.relatedTarget as Node | null;
				if (toElement && e.currentTarget.contains(toElement)) return;
				setIsDragging(false);
			}}
			onDragOver={(e) => {
				e.preventDefault();
			}}
			onDrop={async (e) => {
				e.preventDefault();
				setIsDragging(false);
				const files = await extractImagesFromDrop(e);
				if (!files.length) return;
				await handleFiles(files);
			}}>
			<MediaInputLabel
				children={displayLabel}
				style={labelStyle}
			/>
			{error && <MediaInputError>{error}</MediaInputError>}
			{preview == null ? null : !croppingProportions || previewIsVideo ? (
				<MediaPreviewContainer>
					{previewIsVideo ? (
						<video
							style={{
								maxWidth: previewMaxWidth ?? "100%",
								maxHeight: previewMaxHeight ?? "100%",
								width: "auto",
								height: "auto",
								objectFit: "cover",
							}}
							src={preview}
							controls={!GifVideo}
							autoPlay={GifVideo}
							muted={GifVideo}
							loop={GifVideo}
							playsInline
						/>
					) : (
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
					)}
				</MediaPreviewContainer>
			) : (
				<MediaPreviewContainer
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
				</MediaPreviewContainer>
			)}
			<Controller
				name={fieldName}
				control={control}
				defaultValue={null!}
				render={({ field }) => {
					onChangeRef.current = field.onChange;

					return (
						<MediaInputField
							ref={mediaInputRef}
							type="file"
							multiple={multiple}
							accept={inputAccept}
							style={inputStyle}
							onChange={async (event) => {
								const data: File[] = Array.from(event.target.files ?? []);
								await handleFiles(data);
							}}
						/>
					);
				}}
			/>
		</MediaInputContainer>
	);
};

async function fileToImage(
	file: File,
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = function (e) {
			const img = new Image();

			img.onload = () =>
				resolve({
					width: img.width,
					height: img.height,
				});

			img.onerror = reject;

			if (e.target?.result) {
				img.src = e.target.result as string;
			}
		};

		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

async function fileToVideo(
	file: File,
): Promise<{ width: number; height: number; duration: number }> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const video = document.createElement("video");

		video.onloadedmetadata = () => {
			URL.revokeObjectURL(url);
			resolve({
				width: video.videoWidth,
				height: video.videoHeight,
				duration: video.duration,
			});
		};

		video.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error("Unable to read video metadata"));
		};

		video.src = url;
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

export const MediaInput = forwardRef(MediaInputInner) as MediaInputComponent;
