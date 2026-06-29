import { GenericEffect } from "@/libs/stp@types";
import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./styles.module.css";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HookedForm, SelectOption, zEnumKey } from "@/libs/stp@forms";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import { toast } from "react-hot-toast";
import { StandartTextColor, UIBasics } from "@/components/(UIBasics)";
import { UnlinkEffectButton } from "./subComponents/UnlinkEffectButton";
import { DeleteEffectButton } from "./subComponents/DeleteEffectButton";
import {
	revalidatePathByClientSide,
	revalidateTagByClientSide,
} from "@/utils/ServerActions";
import { capitalize } from "@/utils/StringUtils";
import { ChangeEffectRole } from "./subComponents/ChangeEffectRole";
import { CopyEffectIdsButton } from "./CopyEffectIdsButton";
import { RefObject } from "react";

const schema = z.object({
	name: z.string().min(1, "Must be at leat 1 character long"),
	color: z.string(),
	contents: z.array(
		z.object({
			type: z.string(),
			value: z.string(),
			color: z.string(zEnumKey(StandartTextColor)).nullable(),
			tableData: z.any().nullable(),
		}),
	),
});
type FormInput = z.input<typeof schema>;
type FormData = z.infer<typeof schema>;

const GenericEffectEditorContainer = newStyledElement.div(
	styles.genericEffectEditorContainer,
);

interface GenericEffectEditorProps {
	genericEffect: GenericEffect;
	pathname: string;
	formRef?: RefObject<HTMLFormElement | null>;
}
export function GenericEffectEditor({
	genericEffect,
	pathname,
	formRef,
}: GenericEffectEditorProps) {
	const form = useForm<FormInput, unknown, FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: genericEffect.name,
			color: genericEffect.color ?? "Default",
			contents: genericEffect.contents,
		},
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Saving...");
		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(`/effects/${genericEffect.id}`),
			{
				method: "PUT",
				body: JSON.stringify(formData),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		if (!response.ok) {
			toast.error("Saving failed", { id: toastId });
			return;
		}
		toast.success("Saved", { id: toastId });
		revalidatePathByClientSide(pathname);
		revalidateTagByClientSide("/effects");
		return true;
	}

	const contentTypeOptions: SelectOption[] = ["Text", "Quote"].map((type) => ({
		name: capitalize(type),
		value: type,
	}));
	const colorOptions: SelectOption[] = [
		"Default",
		"Gray",
		"DarkGray",
		"Brown",
		"Orange",
		"Yellow",
		"Green",
		"Blue",
		"Purple",
		"Pink",
		"Red",
	].map((color) => ({
		name: capitalize(color),
		value: color,
	}));

	return (
		<GenericEffectEditorContainer>
			<UIBasics.Box
				backgroundColor="gray"
				flexDirection="row"
				justifyContent="space-between">
				<div style={{ display: "flex", flexDirection: "column" }}>
					<CopyEffectIdsButton
						effectId={genericEffect.id}
						effectLinkId={genericEffect.effectLinkId}
					/>
					<UIBasics.Text
						textColor="blue"
						children={`EffectId: ${genericEffect.id}`}
					/>
					<UIBasics.Text
						textColor="blue"
						children={`LinkId: ${genericEffect.effectLinkId}`}
					/>
					<UIBasics.Text
						textColor="blue"
						children={`Order: ${genericEffect.order}`}
					/>
				</div>
				<div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
					<UnlinkEffectButton
						safetyText={genericEffect.name ?? "IM SURE"}
						linkId={genericEffect.effectLinkId}
						pathname={pathname}
					/>
					<DeleteEffectButton
						safetyText={genericEffect.name ?? "IM SURE"}
						effectId={genericEffect.id}
						pathname={pathname}
					/>
				</div>
			</UIBasics.Box>
			<ChangeEffectRole
				genericEffect={genericEffect}
				pathname={pathname}
			/>
			<HookedForm.Space height={5} />
			<HookedForm.Form
				form={form}
				onSubmit={onSubmit}
				ref={formRef}>
				<HookedForm.TextInput<FormData>
					labelBackground="gray"
					fieldName="name"
					label="Name *"
				/>
				<HookedForm.Select<FormData>
					fieldName="color"
					options={colorOptions}
					label="Color *"
				/>
				<HookedForm.ObjectArrayInput<FormData>
					fieldName="contents"
					label="Contents"
					defaultObject={{
						type: "Text",
						color: "Default",
						value: "",
						tableData: null,
					}}
					childrenGenerator={({ index, lastRef }) => (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
							}}>
							<UIBasics.MultiColumn.Two
								colum1={
									<HookedForm.ObjectArraySelectInput<FormInput>
										fieldName="contents"
										objectKey="type"
										label="Type"
										index={index}
										options={contentTypeOptions}
										labelBackground="gray"
									/>
								}
								colum2={
									<HookedForm.ObjectArraySelectInput<FormInput>
										fieldName="contents"
										objectKey="color"
										label="Color"
										index={index}
										options={colorOptions}
										labelBackground="gray"
									/>
								}
							/>
							<HookedForm.ObjectArrayTextInput<FormInput>
								fieldName="contents"
								objectKey="value"
								label="Value"
								index={index}
								labelBackground="gray"
								useTextArea
								style={{ minHeight: "100px" }}
								ref={lastRef}
							/>
						</div>
					)}
				/>

				<HookedForm.SubmitButton
					label="Salvar"
					useDebugTitle
				/>
			</HookedForm.Form>
		</GenericEffectEditorContainer>
	);
}
