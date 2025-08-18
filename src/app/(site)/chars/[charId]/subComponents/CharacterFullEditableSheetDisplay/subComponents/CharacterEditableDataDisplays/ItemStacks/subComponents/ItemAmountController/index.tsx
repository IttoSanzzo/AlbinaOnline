import { SideActionNumberInputButtons } from "@/components/(UTILS)";
import { getAlbinaApiAddress } from "@/utils/AlbinaApi";
import { authenticatedFetchAsync } from "@/utils/FetchTools";
import { useContext } from "react";
import { ItemsContext } from "../../../../CharacterEditableSheetContextProviders/contexts/Items";
import { Guid } from "@/libs/stp@types";
import toast from "react-hot-toast";
import { CharToastMessage } from "../../..";

interface ItemAmountControllerProps {
	amount: number;
	characterId: Guid;
	itemId: Guid;
}
export function ItemAmountController({
	amount,
	characterId,
	itemId,
}: ItemAmountControllerProps) {
	const { setCharacterItems } = useContext(ItemsContext);

	async function handleItemAmountChange(value: number) {
		const body = {
			amount: value,
		};
		const toastId = toast.loading(CharToastMessage.loading);
		const response = await authenticatedFetchAsync(
			getAlbinaApiAddress(`/chars/${characterId}/items/${itemId}`),
			{
				method: "PATCH",
				body: JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		if (!response.ok) {
			toast.error(CharToastMessage.error, { id: toastId });
			return;
		}
		toast.success(CharToastMessage.success, { id: toastId });
		setCharacterItems((state) => {
			return state.map((itemStack) =>
				itemStack.itemId === itemId
					? { ...itemStack, amount: value }
					: itemStack
			);
		});
	}
	return (
		<SideActionNumberInputButtons
			key={itemId}
			min={1}
			defaultValue={amount}
			action={handleItemAmountChange}
		/>
	);
}
