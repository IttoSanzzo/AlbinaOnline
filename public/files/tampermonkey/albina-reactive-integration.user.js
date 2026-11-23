
// ==UserScript==
// @name         Albina Reactive Integration
// @namespace    https://albina.setsu.party/
// @version      1.2.2
// @description  Integrates Reactive Discord voice states with Albina RPG.
// @icon         https://albina.setsu.party/favicon.ico
// @match        https://reactive.fugi.tech/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
	"use strict";

	const ALBINA_ORIGIN = "https://albina.setsu.party";
	const PLAYER_SELECTOR = "[data-discord-id]";
	const HEARTBEAT_INTERVAL = 5000;

	const previousStates = new Map();

	function postToAlbina(message) {
		if (window.parent === window) return false;

		try {
			window.parent.postMessage(message, ALBINA_ORIGIN);
			return true;
		} catch (error) {
			return false;
		}
	}

	function publishHeartbeat() {
		const sent = postToAlbina({
			type: "ALBINA_VOICE_HEARTBEAT",
			timestamp: Date.now(),
		});
	}

	function startHeartbeat() {
		publishHeartbeat();
		setInterval(publishHeartbeat, HEARTBEAT_INTERVAL);
	}

	function getConfiguredDiscordId() {
		const embed = document.querySelector("#embed");
		if (!embed) return null;

		const config = embed.getAttribute("data-config");
		if (!config) return null;

		try {
			const parsedConfig = JSON.parse(config);

			return typeof parsedConfig.id === "string"
				? parsedConfig.id
				: null;
		} catch (error) {
			return null;
		}
	}

	function getVoiceState(element) {
		const discordId = element.getAttribute("data-discord-id");
		if (!discordId) return null;

		return {
			discordId,
			inCall: true,
			speaking: element.getAttribute("data-speaking") === "true",
			muted: element.getAttribute("data-muted") === "true",
			deafened: element.getAttribute("data-deafened") === "true",
		};
	}

	function hasStateChanged(previous, current) {
		return (
			!previous ||
			previous.discordId !== current.discordId ||
			previous.inCall !== current.inCall ||
			previous.speaking !== current.speaking ||
			previous.muted !== current.muted ||
			previous.deafened !== current.deafened
		);
	}

	function publishVoiceState(state) {

		const sent = postToAlbina({
			type: "ALBINA_VOICE_STATE",
			state,
		});
	}

	function updateVoiceState(state) {
		const previousState = previousStates.get(state.discordId);
		if (!hasStateChanged(previousState, state)) return;

		previousStates.set(state.discordId, state);
		publishVoiceState(state);
	}

	function observePlayer(element) {
		const state = getVoiceState(element);
		if (!state) return;

		updateVoiceState(state);
	}

	function publishNotInCall(discordId) {
		updateVoiceState({
			discordId,
			inCall: false,
			speaking: false,
			muted: false,
			deafened: false,
		});
	}

	function scanPlayers() {
		const players = document.querySelectorAll(PLAYER_SELECTOR);
		const presentDiscordIds = new Set();

		players.forEach((element) => {
			const state = getVoiceState(element);
			if (!state) return;

			presentDiscordIds.add(state.discordId);
			observePlayer(element);
		});

		for (const discordId of previousStates.keys()) {
			if (presentDiscordIds.has(discordId)) continue;
			publishNotInCall(discordId);
		}

		const configuredDiscordId = getConfiguredDiscordId();

		if (
			configuredDiscordId &&
			!presentDiscordIds.has(configuredDiscordId)
		) {
			publishNotInCall(configuredDiscordId);
		}
	}

	const observer = new MutationObserver(() => {
		scanPlayers();
	});

	function initialize() {
		scanPlayers();

		observer.observe(document.documentElement, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: [
				"data-discord-id",
				"data-speaking",
				"data-muted",
				"data-deafened",
			],
		});

		startHeartbeat();
	}

	initialize();
})();
