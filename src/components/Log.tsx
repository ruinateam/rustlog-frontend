import React, { useContext } from "react";
import styled from "styled-components";
import { Txt } from "../icons/Txt";
import { getUserId, isUserId } from "../services/isUserId";
import { store } from "../store";
import { ContentLog } from "./ContentLog";
import { TwitchChatContentLog } from "./TwitchChatLogContainer";

const LogContainer = styled.div`
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1rem;

    .txt {
        position: absolute;
        top: 5px;
        right: 15px;
        opacity: 0.9;
        cursor: pointer;
        z-index: 999;

        &:hover {
            opacity: 1;
        }
    }
`;

export function Log({ year, month, day }: { year: string, month: string, day?: string }) {
    const { state } = useContext(store);

    let txtHref = `${state.apiBaseUrl}`
    if (state.currentChannel && isUserId(state.currentChannel)) {
        txtHref += `/channelid/${getUserId(state.currentChannel)}`
    } else {
        txtHref += `/channel/${state.currentChannel}`
    }

    if (state.currentUsername) {
        if (isUserId(state.currentUsername)) {
            txtHref += `/userid/${getUserId(state.currentUsername)}`
        } else {
            txtHref += `/user/${state.currentUsername}`
        }
    }

    txtHref += `/${year}/${month}${day ? `/${day}` : ""}?reverse`;

    return <LogContainer>
        <a className="txt" aria-label="Open text export" target="_blank" href={txtHref} rel="noopener noreferrer"><Txt /></a>
        {!state.settings.twitchChatMode.value && <ContentLog year={year} month={month} day={day} />}
        {state.settings.twitchChatMode.value && <TwitchChatContentLog year={year} month={month} day={day} />}
    </LogContainer>
}
