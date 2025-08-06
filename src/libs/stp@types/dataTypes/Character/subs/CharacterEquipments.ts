import { Guid } from "@/libs/stp@types/misc";

export enum EquipmentSlotType {
	Unknown,
	// Main
	Frame,
	OneHand,
	TwoHanded,
	Head,
	Feet,
	// Extra
	Torso,
	Arms,
	Face,
	Waist,
	Earring,
	Necklace,
	Bracelet,
	Ring,
}
export enum EquipmentSlot {
	Unknown,
	// Main
	Frame,
	MainHand,
	OffHand,
	Head,
	Feet,
	// Extra
	Torso,
	Arms,
	Face,
	Waist,
	Earring,
	Necklace,
	Bracelet,
	Ring,
}

export type CharacterEquipments = {
	characterId: Guid;
	slots: Partial<Record<keyof typeof EquipmentSlot, Guid[]>>;
};

export function isSlotCompatibleWithType(
	slot: EquipmentSlot,
	type: EquipmentSlotType
): boolean {
	switch (type) {
		case EquipmentSlotType.OneHand:
			return slot === EquipmentSlot.MainHand || slot === EquipmentSlot.OffHand;
		case EquipmentSlotType.TwoHanded:
			return slot === EquipmentSlot.MainHand;
		case EquipmentSlotType.Frame:
			return slot === EquipmentSlot.Frame;
		case EquipmentSlotType.Head:
			return slot === EquipmentSlot.Head;
		case EquipmentSlotType.Feet:
			return slot === EquipmentSlot.Feet;
		case EquipmentSlotType.Torso:
			return slot === EquipmentSlot.Torso;
		case EquipmentSlotType.Arms:
			return slot === EquipmentSlot.Arms;
		case EquipmentSlotType.Face:
			return slot === EquipmentSlot.Face;
		case EquipmentSlotType.Waist:
			return slot === EquipmentSlot.Waist;
		case EquipmentSlotType.Earring:
			return slot === EquipmentSlot.Earring;
		case EquipmentSlotType.Necklace:
			return slot === EquipmentSlot.Necklace;
		case EquipmentSlotType.Bracelet:
			return slot === EquipmentSlot.Bracelet;
		case EquipmentSlotType.Ring:
			return slot === EquipmentSlot.Ring;
		default:
			return false;
	}
}
