import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { OptOutError } from "../errors/OptOutError";
import { AvailableLog, useAvailableLogs } from "../hooks/useAvailableLogs";
import { store } from "../store";
import { Log } from "./Log";
import { OptOutMessage } from "./OptOutMessage";

const LogContainerDiv = styled.div`
    display: grid;
    grid-template-columns: minmax(11rem, 15rem) minmax(0, 1fr);
    gap: 1rem;
    max-width: 96rem;
    margin: 0 auto;
    padding: 0 clamp(0.8rem, 3vw, 2.5rem) 2rem;

    @media (max-width: 760px) {
        grid-template-columns: 1fr;
    }
`;

const Periods = styled.nav`
    align-self: start;
    position: sticky;
    top: 6.7rem;
    padding: 0.9rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.75rem;

    h2, p { margin: 0; }
    h2 { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
    p { margin-top: 0.45rem; font-size: 0.82rem; color: var(--muted); }

    @media (max-width: 760px) {
        position: static;
        display: flex;
        align-items: center;
        gap: 0.7rem;
        overflow-x: auto;
        h2, p { display: none; }
    }
`;

const PeriodButton = styled.button<{ $selected: boolean }>`
    width: 100%;
    margin-top: 0.45rem;
    padding: 0.55rem 0.65rem;
    color: ${props => props.$selected ? "var(--text)" : "var(--muted)"};
    text-align: left;
    font: inherit;
    font-family: var(--font-mono);
    background: ${props => props.$selected ? "var(--surface-raised)" : "transparent"};
    border: 1px solid ${props => props.$selected ? "var(--border-strong)" : "transparent"};
    border-radius: 0.45rem;
    cursor: pointer;

    &:hover { border-color: var(--border-strong); }

    @media (max-width: 760px) { width: auto; white-space: nowrap; margin-top: 0; }
`;

const Workspace = styled.section`
    min-width: 0;
`;

const WorkspaceHeader = styled.header`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.4rem 0.2rem 0.8rem;

    h1 { margin: 0; font-size: clamp(1.15rem, 2vw, 1.5rem); }
    span { color: var(--muted); font-size: 0.85rem; }

    @media (max-width: 760px) {
        align-items: flex-start;
        flex-direction: column;
        gap: 0.35rem;
    }
`;

const Scope = styled.span`
    display: inline-flex;
    align-items: center;
    margin-left: 0.55rem;
    padding: 0.2rem 0.45rem;
    color: var(--text);
    font: 0.7rem var(--font-mono);
    text-transform: uppercase;
    border: 1px solid var(--border-strong);
    border-radius: 999px;
`;

const EmptyState = styled.section`
    padding: 3rem 1.2rem;
    color: var(--muted);
    text-align: center;
    background: var(--surface);
    border: 1px dashed var(--border-strong);
    border-radius: 0.75rem;
`;

export function LogContainer() {
    const { state } = useContext(store);

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? "metaKey" : "ctrlKey";

    useEffect(() => {
        const listener = function (e: KeyboardEvent) {
            if (e.key === 'f' && e[ctrlKey] && !state.settings.twitchChatMode.value) {
                e.preventDefault();
                if (state.activeSearchField) {
                    state.activeSearchField.focus();
                }
            }
        };

        window.addEventListener("keydown", listener)

        return () => window.removeEventListener("keydown", listener);
    }, [state.activeSearchField, state.settings.twitchChatMode.value, ctrlKey]);

    const [availableLogs, err] = useAvailableLogs(state.currentChannel, state.currentUsername);
    const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
    const periodKey = (period: AvailableLog) => [period.year, period.month, period.day].filter(Boolean).join("-");
    const periodLabel = (period: AvailableLog) => [period.year, period.month, period.day].filter(Boolean).join("/");
    const periods = [...availableLogs].sort((left, right) => periodKey(right).localeCompare(periodKey(left)));
    const selected = periods.find(period => periodKey(period) === selectedPeriod) ?? periods[0];

    useEffect(() => {
        if (selected) {
            setSelectedPeriod(periodKey(selected));
        }
    }, [selected?.year, selected?.month, selected?.day]);

    if (err instanceof OptOutError) {
        return <OptOutMessage />;
    }

    if (!state.currentChannel) {
        return <LogContainerDiv><EmptyState>Select a channel. Add a user to narrow the stream, or leave it empty for the complete channel log.</EmptyState></LogContainerDiv>;
    }

    if (!selected) {
        return <LogContainerDiv><EmptyState>No stored periods for this query.</EmptyState></LogContainerDiv>;
    }

    return <LogContainerDiv>
        <Periods aria-label="Available log periods">
            <h2>Available periods</h2>
            <p>{periods.length} stored {state.currentUsername ? (periods.length === 1 ? "month" : "months") : (periods.length === 1 ? "day" : "days")}</p>
            {periods.map(period => {
                const key = periodKey(period);
                return <PeriodButton key={key} $selected={key === periodKey(selected)} onClick={() => setSelectedPeriod(key)}>{periodLabel(period)}</PeriodButton>;
            })}
        </Periods>
        <Workspace>
            <WorkspaceHeader>
                <h1>{state.currentChannel}{state.currentUsername ? ` / ${state.currentUsername}` : ""}<Scope>{state.currentUsername ? "user" : "channel"}</Scope></h1>
                <span>Loaded period: {periodLabel(selected)} · up to 5,000 messages</span>
            </WorkspaceHeader>
            <Log year={selected.year} month={selected.month} day={selected.day} />
        </Workspace>
    </LogContainerDiv>
}
