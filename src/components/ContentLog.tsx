import { InputAdornment, TextField } from "@mui/material";
import { Search } from "@mui/icons-material";
import React, { useContext, useState, CSSProperties, useRef, useEffect } from "react";
import styled from "styled-components";
import { useLog } from "../hooks/useLog";
import { useThirdPartyEmotes } from "../hooks/useThirdPartyEmotes";
import { store } from "../store";
import { LogLine } from "./LogLine";
import { FixedSizeList as List } from 'react-window';
import { useChatBadges } from "../hooks/useChatBadges";

const ContentLogContainer = styled.ul`
    padding: 0;
    margin: 0;
    position: relative;

    .search { width: min(100%, 24rem); margin-bottom: 0.8rem; }

    .logLine {
        white-space: nowrap;
    }

    .list {
        scrollbar-color: var(--border-strong) transparent;
        border-top: 1px solid var(--border);
    }
`;

export function ContentLog({ year, month, day }: { year: string, month: string, day?: string }) {
    const { state, setState } = useContext(store);
    const [searchText, setSearchText] = useState("");

    const logs = useLog(state.currentChannel ?? "", state.currentUsername ?? "", year, month, day)
        .filter(log => log.text.toLowerCase().includes(searchText.toLowerCase()));
    const thirdPartyEmotes = useThirdPartyEmotes(logs[0]?.tags["room-id"] ?? "");
    const badges = useChatBadges(logs[0]?.tags["room-id"] ?? "");

    const Row = ({ index, style }: { index: number, style: CSSProperties }) => (
        <div style={style}><LogLine key={logs[index].id ? logs[index].id : index} message={logs[index]} thirdPartyEmotes={thirdPartyEmotes} badges={badges} /></div>
    );

    const search = useRef<HTMLInputElement>(null);

    const handleMouseEnter = () => {
        setState({ ...state, activeSearchField: search.current })
    }

    useEffect(() => {
        setState({ ...state, activeSearchField: search.current })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (logs.length === 0) {
        return <ContentLogContainer>
            <p style={{ margin: 0, padding: "8px 0" }}>No logs for {[year, month, day].filter(Boolean).join("/")}.</p>
        </ContentLogContainer>;
    }

    return <ContentLogContainer onMouseEnter={handleMouseEnter}>
        <TextField
            className="search"
            label="Search"
            inputRef={search}
            onChange={e => setSearchText(e.target.value)}
            size="small"
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                ),
            }}
        />
        <List
            className="list"
            height={Math.max(360, Math.min(680, window.innerHeight - 270))}
            itemCount={logs.length}
            itemSize={20}
            width={"100%"}
        >
            {Row}
        </List>
    </ContentLogContainer>
}
