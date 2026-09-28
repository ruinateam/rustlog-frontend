import React, { useContext } from "react";
import styled from "styled-components";
import { useLog } from "../hooks/useLog";
import { useThirdPartyEmotes } from "../hooks/useThirdPartyEmotes";
import { store } from "../store";
import { TwitchChatLogLine } from "./TwitchChatLogLine";
import { useChatBadges } from "../hooks/useChatBadges";

const ContentLogContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: min(680px, calc(100vh - 17rem));
    overflow-y: auto;
`;

export function TwitchChatContentLog({ year, month, day }: { year: string, month: string, day?: string }) {
    const { state } = useContext(store);

    const logs = useLog(state.currentChannel ?? "", state.currentUsername ?? "", year, month, day)
    const thirdPartyEmotes = useThirdPartyEmotes(logs[0]?.tags["room-id"] ?? "");
    const badges = useChatBadges(logs[0]?.tags["room-id"] ?? "");

    return <ContentLogContainer>
        {logs.map((log, index) => <TwitchChatLogLine key={log.id ? log.id : index} message={log} thirdPartyEmotes={thirdPartyEmotes} badges={badges} />)}
    </ContentLogContainer>
}
