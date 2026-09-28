import React, { useContext } from "react";
import styled from "styled-components";
import DescriptionIcon from '@mui/icons-material/Description';
import { IconButton } from "@mui/material";
import { store } from "../store";

const DocsWrapper = styled.div`
    height: 40px;
`;

export function Docs() {
    const { state } = useContext(store);

    const handleClick = () => {
        const base = state.apiBaseUrl.replace(/\/$/, "");
        const docsUrl = `${base}/docs`;
        window.location.href = docsUrl;
    }

    return <DocsWrapper>
        <IconButton aria-controls="docs" aria-haspopup="true" onClick={handleClick} size="small" color="default">
            <DescriptionIcon />
        </IconButton>
    </DocsWrapper>;
}
