import { Button, TextField } from "@mui/material";
import { Autocomplete } from '@mui/material';
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import styled from "styled-components";
import { useChannels } from "../hooks/useChannels";
import { store } from "../store";
import { Docs } from "./Docs";
import { Optout } from "./Optout";
import { Settings } from "./Settings";

const FiltersContainer = styled.form`
    display: grid;
    grid-template-columns: minmax(12rem, 1fr) minmax(12rem, 1fr) auto auto auto auto;
    align-items: center;
    gap: 0.65rem;
    width: min(100%, 76rem);
    padding: 0.8rem;
    background: color-mix(in srgb, var(--surface) 92%, transparent);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.2);

    > div, > button {
        min-width: 0;
        height: 40px;
    }

    @media (max-width: 760px) {
        grid-template-columns: 1fr auto auto auto;
        border-radius: 0.6rem;

        > :nth-child(1),
        > :nth-child(2) {
            grid-column: 1 / -1;
            width: 100%;
        }

        > button[type="submit"] {
            grid-column: 1 / -1;
        }
    }
`;

const FiltersWrapper = styled.div`
    position: sticky;
    top: 0;
    z-index: 20;
    padding: 1rem clamp(0.8rem, 3vw, 2.5rem);
    background: color-mix(in srgb, var(--canvas) 88%, transparent);
    backdrop-filter: blur(14px);
`;

export function Filters() {
    const { setCurrents, state } = useContext(store);
    const queryClient = useQueryClient();
    const channels = useChannels();
    const [channel, setChannel] = useState(state.currentChannel ?? "");
    const [username, setUsername] = useState(state.currentUsername ?? "");

    useEffect(() => setChannel(state.currentChannel ?? ""), [state.currentChannel]);
    useEffect(() => setUsername(state.currentUsername ?? ""), [state.currentUsername]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        queryClient.removeQueries("log");
        setCurrents(channel, username);
    };

    return <FiltersWrapper>
        <FiltersContainer onSubmit={handleSubmit} action="none">
            <Autocomplete
                id="autocomplete-channels"
                options={channels.map(channel => channel.name)}
                style={{ width: "100%" }}
                inputValue={channel}
                onInputChange={(_, value) => setChannel(value)}
                onChange={(_, value) => setChannel(value ?? "")}
                getOptionLabel={(channel: string) => channel}
                clearOnBlur={false}
                renderInput={(params) => <TextField {...params} label="Channel or id:123" variant="outlined" size="small" autoFocus={state.currentChannel === null} />}
            />
            <TextField error={state.error} label="User or id:123 (optional)" variant="outlined" size="small" autoComplete="off" value={username} onChange={event => setUsername(event.target.value)} autoFocus={state.currentChannel !== null && state.currentUsername === null} />
            <Button variant="contained" color="primary" type="submit">Load logs</Button>
            <Settings />
            <Docs />
            <Optout />
        </FiltersContainer>
    </FiltersWrapper>
}
