import { HookedForm } from "@/libs/stp@forms";
import styles from "./ChangeLocationMapImage.module.css";
import { Dialog } from "@/libs/stp@radix";
import { LocationData } from "@/libs/stp@types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticatedFetchAsync } from "@/utils/FetchClientTools";
import { getAlbinaApiFullAddress } from "@/utils/AlbinaApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { revalidateTagByClientSide } from "@/utils/ServerActions";

const schema = z.object({
	image: z.instanceof(File),
});

type FormData = z.infer<typeof schema>;

interface ChangeLocationMapImageProps {
	locationData: LocationData;
}
export function ChangeLocationMapImage({
	locationData,
}: ChangeLocationMapImageProps) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const router = useRouter();

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: { image: undefined },
		mode: "all",
	});

	async function onSubmit(formData: FormData) {
		const toastId = toast.loading("Saving...");

		const bodyData = new FormData();
		bodyData.append("file", formData.image);

		const response = await authenticatedFetchAsync(
			getAlbinaApiFullAddress(
				`/images/atlas/${locationData.slug}/location-map`,
			),
			{ method: "PUT", body: bodyData },
		);
		if (!response.ok) {
			toast.error("Error", { id: toastId });
			return;
		}
		setIsOpen(false);
		toast.success("Saved", { id: toastId });
		await revalidateTagByClientSide(
			`/images/atlas/${locationData.slug}/location-map`,
		);
		router.refresh();
	}

	return (
		<Dialog.Root open={isOpen}>
			<Dialog.Trigger
				className={styles.trigger}
				onClick={() => setIsOpen(true)}>
				Change Map Image
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay onClick={() => setIsOpen(false)} />
				<Dialog.Content>
					<Dialog.Title>Change Map Image</Dialog.Title>

					<HookedForm.Form
						form={form}
						onSubmit={onSubmit}>
						<HookedForm.Space />
						<HookedForm.ImageInput<FormData> fieldName="image" />
						<HookedForm.SubmitButton label="Save" />
						<HookedForm.Space />
					</HookedForm.Form>

					<Dialog.Description />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
