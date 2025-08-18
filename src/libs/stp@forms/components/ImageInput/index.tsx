import { CSSProperties, useState } from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import * as NextImage from "next/image";
import { StandartBackgroundColor } from "@/components/(UIBasics)";
import { useHookedForm } from "../../context/HookedFormContext";

const ImageInputContainer = newStyledElement.div(styles.imageInputContainer);
const ImageInputField = newStyledElement.input(styles.imageInputField);
const ImageInputLabel = newStyledElement.label(styles.imageInputLabel);
const ImageInputError = newStyledElement.div(styles.imageInputError);
const ImagePreviewContainer = newStyledElement.div(
	styles.imagePreviewContainer
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
}: ImageInputProps<TFormData>) {
	const {
		form: { control },
		triggerDebounceAction,
	} = useHookedForm<TFormData>();
	const [preview, setPreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const inputStyle: CSSProperties = {};
	const labelStyle: CSSProperties = {
		...(labelBackground && {
			backgroundColor: StandartBackgroundColor[labelBackground],
		}),
	};

	async function validateImage(file: File): Promise<string | null> {
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
					2
				)}`;
		}
		return null;
	}

	return (
		<ImageInputContainer>
			<ImageInputLabel
				children={label}
				style={labelStyle}
			/>
			{error && <ImageInputError>{error}</ImageInputError>}
			{preview && (
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
			)}
			<Controller
				name={fieldName}
				control={control}
				defaultValue={null!}
				render={({ field }) => (
					<ImageInputField
						type="file"
						accept={accept}
						style={inputStyle}
						onChange={async (event) => {
							const file = event.target.files?.[0];
							if (!file) return;
							const err = await validateImage(file);
							if (err) {
								setError(err);
								field.onChange(null);
								setPreview(null);
								return;
							}
							setError(null);
							setPreview(URL.createObjectURL(file));
							field.onChange(file);
							triggerDebounceAction();
						}}
					/>
				)}
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
