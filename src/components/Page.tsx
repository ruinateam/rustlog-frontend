import React, { useContext } from "react";
import styled from "styled-components";
import { store } from "../store";
import { Filters } from "./Filters";
import { LogContainer } from "./LogContainer";
import { OptoutPanel } from "./Optout";

const PageContainer = styled.div`
    min-height: 100vh;
    color: var(--text);
    background:
        radial-gradient(circle at 75% -10%, rgba(255, 255, 255, 0.07), transparent 30rem),
        var(--canvas);
`;

export function Page() {
	const {state} = useContext(store);

	return <PageContainer>
		<Filters />
		{state.showOptout && <OptoutPanel />}
		<LogContainer />
	</PageContainer>;
}
