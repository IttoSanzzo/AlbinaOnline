import { newStyledElement } from "@setsu-tp/styled-components";
import styles from "./index.module.css";
import { memo, useEffect, useState } from "react";
import { useVttContext } from "../../../Contexts/VttContextProvider";
import { Guid } from "@/libs/stp@types";
import { PIXELS_PER_CENTIMETER } from "../../../Contexts/VttViewportContextProvider";
import { useVttThrottledViewportContext } from "../../../Contexts/VttThrottledViewportContext";
import { VttTokenElement } from "./VttTokenElement";
import {
	VttToken,
	VttTokenWithScenePlacement,
} from "../../../Types/Classes/VttToken";
import { VttResourceLockDto } from "../../../Types/Classes/VttResourceLock";
import { CoordinatePair } from "@/libs/stp@types/utils/CoordinatePair";

const TokenBoardLayerContainer = newStyledElement.div(
	styles.tokenBoardLayerContainer,
);

export const TokenBoardLayer = memo(function TokenBoardLayer() {
	const { camera, worldToScreen, viewport } =
		useVttThrottledViewportContext(100);
	const { activeSceneId, subscribe } = useVttContext();
	const [vttTokens, setVttTokens] = useState<
		Map<Guid, VttTokenWithScenePlacement>
	>(new Map());
	const [vttTokenInCurrentSceneIds, setVttTokenInCurrentSceneIds] = useState<
		Guid[]
	>([]);

	useEffect(() => {
		const unsubscribe1 = subscribe("VttCompleteSceneSnapshot", (event) => {
			const sceneId = (event.data as { sceneId: Guid }).sceneId;
			const rawTokensPayload = (
				event.data as { tokens: VttTokenWithScenePlacement[] }
			).tokens;
			const refinedTokensPayload: VttTokenWithScenePlacement[] =
				rawTokensPayload.map((token) => {
					return {
						...token,
						scenePlacement: token.vttTokenPlacement.find(
							(placement) => placement.sceneId === sceneId,
						)!,
					};
				});

			setVttTokenInCurrentSceneIds(
				refinedTokensPayload
					.filter((token) => token.scenePlacement)
					.map((token) => token.id),
			);
			setVttTokens(
				new Map(refinedTokensPayload.map((token) => [token.id, token])),
			);
		});
		const unsubscribe2 = subscribe("VttTokenAdded", (event) => {
			const rawToken = (event.data as { vttToken: VttToken }).vttToken;
			const refinedToken = {
				...rawToken,
				scenePlacement: rawToken.vttTokenPlacement.find(
					(placement) => placement.sceneId === activeSceneId,
				)!,
			};
			setVttTokens((state) => {
				const next = new Map(state);
				next.set(refinedToken.id, refinedToken);
				return next;
			});
			setVttTokenInCurrentSceneIds((state) => [...state, refinedToken.id]);
		});
		const unsubscribe3 = subscribe("VttTokenUpdated", (event) => {
			const rawToken = (event.data as { vttToken: VttToken }).vttToken;
			const refinedToken = {
				...rawToken,
				scenePlacement: rawToken.vttTokenPlacement.find(
					(placement) => placement.sceneId === activeSceneId,
				)!,
			};
			setVttTokens((state) => {
				const next = new Map(state);
				next.set(refinedToken.id, refinedToken);
				return next;
			});
			setVttTokenInCurrentSceneIds((state) => [
				...state.filter((id) => id != refinedToken.id),
				refinedToken.id,
			]);
		});
		const unsubscribe4 = subscribe("VttTokenRemoved", (event) => {
			const vttTokenId = (event.data as { vttTokenId: Guid }).vttTokenId;
			setVttTokens((state) => {
				const next = new Map(state);
				next.delete(vttTokenId);
				return next;
			});
			setVttTokenInCurrentSceneIds((state) =>
				state.filter((id) => id != vttTokenId),
			);
		});
		const unsubscribeDragStarted = subscribe("VttTokenDragStarted", (event) => {
			const payload = event.data as {
				vttTokenId: Guid;
				resourceLock: VttResourceLockDto;
			};
			setVttTokens((state) => {
				const vttToken = state.get(payload.vttTokenId);
				if (!vttToken) return state;
				const next = new Map(state);
				next.set(payload.vttTokenId, {
					...vttToken,
					resourceLocks: [
						...vttToken.resourceLocks.filter(
							(resourceLock) =>
								!(
									resourceLock.lockType == payload.resourceLock.lockType &&
									resourceLock.sceneId == payload.resourceLock.sceneId
								),
						),
						payload.resourceLock,
					],
				});
				return next;
			});
		});
		const unsubscribeDragUpdate = subscribe("VttTokenDragUpdate", (event) => {
			const payload = event.data as {
				vttTokenId: Guid;
				sceneId: Guid;
				coordinates: CoordinatePair;
			};
			setVttTokens((state) => {
				const vttToken = state.get(payload.vttTokenId);
				if (!vttToken) return state;
				const placement = vttToken.vttTokenPlacement.find(
					(placement) => placement.sceneId == payload.sceneId,
				);
				if (!placement) return state;

				const next = new Map(state);
				placement.coordinates = payload.coordinates;

				next.set(payload.vttTokenId, {
					...vttToken,
					vttTokenPlacement: [
						...vttToken.vttTokenPlacement.filter(
							(placement) => placement.sceneId != payload.sceneId,
						),
						placement,
					],
					scenePlacement:
						payload.sceneId == activeSceneId
							? placement
							: vttToken.scenePlacement,
				});
				return next;
			});
		});
		const unsubscribeDragEnded = subscribe("VttTokenDragEnded", (event) => {
			const payload = event.data as {
				vttTokenId: Guid;
				sceneId: Guid;
				coordinates: CoordinatePair;
			};
			setVttTokens((state) => {
				const vttToken = state.get(payload.vttTokenId);
				if (!vttToken) return state;
				const placement = vttToken.vttTokenPlacement.find(
					(placement) => placement.sceneId == payload.sceneId,
				);
				if (!placement) return state;

				const next = new Map(state);
				placement.coordinates = payload.coordinates;

				next.set(payload.vttTokenId, {
					...vttToken,
					vttTokenPlacement: [
						...vttToken.vttTokenPlacement.filter(
							(placement) => placement.sceneId != payload.sceneId,
						),
						placement,
					],
					scenePlacement:
						payload.sceneId == activeSceneId
							? placement
							: vttToken.scenePlacement,
					resourceLocks: vttToken.resourceLocks.filter(
						(resourceLock) =>
							!(
								resourceLock.lockType == "drag" &&
								resourceLock.sceneId == payload.sceneId
							),
					),
				});
				return next;
			});
			if (payload.sceneId == activeSceneId)
				setVttTokenInCurrentSceneIds((state) => [
					...state.filter((id) => id != payload.vttTokenId),
					payload.vttTokenId,
				]);
		});
		const unsubscribeDragCanceled = subscribe(
			"VttTokenDragCanceled",
			(event) => {
				const payload = event.data as {
					vttTokenId: Guid;
					sceneId: Guid;
					coordinates: CoordinatePair;
				};
				setVttTokens((state) => {
					const vttToken = state.get(payload.vttTokenId);
					if (!vttToken) return state;
					const placement = vttToken.vttTokenPlacement.find(
						(placement) => placement.sceneId == payload.sceneId,
					);
					if (!placement) return state;

					const next = new Map(state);
					placement.coordinates = payload.coordinates;

					next.set(payload.vttTokenId, {
						...vttToken,
						vttTokenPlacement: [
							...vttToken.vttTokenPlacement.filter(
								(placement) => placement.sceneId != payload.sceneId,
							),
							placement,
						],
						scenePlacement:
							payload.sceneId == activeSceneId
								? placement
								: vttToken.scenePlacement,
						resourceLocks: vttToken.resourceLocks.filter(
							(resourceLock) =>
								!(
									resourceLock.lockType == "drag" &&
									resourceLock.sceneId == payload.sceneId
								),
						),
					});
					return next;
				});
			},
		);
		return () => {
			unsubscribe1();
			unsubscribe2();
			unsubscribe3();
			unsubscribe4();
			unsubscribeDragStarted();
			unsubscribeDragUpdate();
			unsubscribeDragEnded();
			unsubscribeDragCanceled();
		};
	}, [subscribe, activeSceneId]);

	const cullingMargin = Math.max(viewport.width, viewport.height) * 0.5;

	if (!activeSceneId) return null;
	return (
		<TokenBoardLayerContainer>
			{vttTokenInCurrentSceneIds.map((vttTokenPlacement) => {
				const vttToken = vttTokens.get(vttTokenPlacement);
				if (!vttToken) return null;
				const coordinates = worldToScreen(vttToken.scenePlacement.coordinates);
				const scale = PIXELS_PER_CENTIMETER * camera.zoom;
				const size = Math.max(100, 100) * scale;
				const halfSize = size / 2;
				const isVisible =
					coordinates.x + halfSize >= -cullingMargin &&
					coordinates.y + halfSize >= -cullingMargin &&
					coordinates.x - halfSize <= viewport.width + cullingMargin &&
					coordinates.y - halfSize <= viewport.height + cullingMargin;
				if (!isVisible) return null;
				return (
					<VttTokenElement
						key={vttToken.id}
						vttToken={vttToken}
					/>
				);
			})}
		</TokenBoardLayerContainer>
	);
});
