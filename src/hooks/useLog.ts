import { useContext } from "react";
import { useQuery } from "react-query";
import { getUserId, isUserId } from "../services/isUserId";
import { store } from "../store";
import { Emote, LogMessage, UserLogResponse } from "../types/log";
import runes from "runes";



export function useLog(channel: string, username: string, year: string, month: string, day?: string): Array<LogMessage> {
    const { state } = useContext(store);

    const { data } = useQuery<Array<LogMessage>>(["log", { channel, username, year, month, day }], () => {
        if (channel && (username || day)) {
            const channelIsId = isUserId(channel);
            const usernameIsId = username ? isUserId(username) : false;

            if (channelIsId) {
                channel = getUserId(channel)
            }
            if (username && usernameIsId) {
                username = getUserId(username)
            }

            const channelPath = `${state.apiBaseUrl}/channel${channelIsId ? "id" : ""}/${channel}`;
            const logPath = username
                ? `${channelPath}/user${usernameIsId ? "id" : ""}/${username}/${year}/${month}`
                : `${channelPath}/${year}/${month}/${day}`;
            const queryUrl = new URL(logPath);
            queryUrl.searchParams.append("jsonBasic", "1");
            queryUrl.searchParams.append("limit", "5000");
            if (!state.settings.newOnBottom.value) {
                queryUrl.searchParams.append("reverse", "1");
            }

            return fetch(queryUrl.toString())
                .then(async (response) => {
                    if (response.status === 404) {
                        return null;
                    }
                    if (response.ok) {
                        return response;
                    }

                    throw Error(response.statusText);
                })
                .then(response => {
                    if (response === null) {
                        return { messages: [] } as UserLogResponse;
                    }
                    return response.json();
                })
                .then((data: UserLogResponse) => {
                    const messages: Array<LogMessage> = [];

                    for (const msg of data.messages) {
                        messages.push({ ...msg, timestamp: new Date(msg.timestamp), emotes: parseEmotes(msg.text, msg.tags["emotes"]) })
                    }

                    return messages;
                });
        }

        return [];
    }, { refetchOnWindowFocus: false, refetchOnReconnect: false });

    return data ?? [];
}

function parseEmotes(messageText: string, emotes: string | undefined): Array<Emote> {
    const parsed: Array<Emote> = [];
    if (!emotes) {
        return parsed;
    }

    const groups = emotes.split("/");

    for (const group of groups) {
        const [id, positions] = group.split(":");
        const positionGroups = positions.split(",");

        for (const positionGroup of positionGroups) {
            const [startPos, endPos] = positionGroup.split("-");

            const startIndex = Number(startPos);
            const endIndex = Number(endPos) + 1;

            parsed.push({
                id,
                startIndex: startIndex,
                endIndex: endIndex,
                code: runes.substr(messageText, startIndex, endIndex - startIndex + 1)
            });
        }
    }

    return parsed;
}
