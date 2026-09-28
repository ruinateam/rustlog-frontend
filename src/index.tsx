import { StrictMode } from 'react';
import { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from 'react-query';
import { Page } from './components/Page';
import { StateProvider, store } from './store';
import { createTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

const pageTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: { main: '#f4f4f5', contrastText: '#09090b' },
		background: { default: '#09090b', paper: '#111113' },
		text: { primary: '#f4f4f5', secondary: '#8d8d93' },
		divider: '#29292d',
	},
	shape: { borderRadius: 8 },
	components: {
		MuiButton: {
			styleOverrides: {
				root: { minHeight: 40, borderRadius: 8, paddingInline: 16, textTransform: 'none', fontWeight: 600 },
				containedPrimary: { backgroundColor: '#f4f4f5', color: '#09090b', boxShadow: 'none', '&:hover': { backgroundColor: '#ffffff', boxShadow: 'none' } },
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: { width: 40, height: 40, border: '1px solid #29292d', borderRadius: 8 },
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: { minHeight: 40, backgroundColor: '#111113', borderRadius: 8 },
				input: { paddingTop: 9, paddingBottom: 9 },
			},
		},
	},
});

function App() {
	const { state } = useContext(store);

	return <QueryClientProvider client={state.queryClient}>
		<Page />
	</QueryClientProvider>
}

const container = document.getElementById('root') as Element;
const root = createRoot(container);

root.render(
	<StrictMode>
		<StateProvider>
			<ThemeProvider theme={pageTheme}>
				<App />
			</ThemeProvider>
		</StateProvider>
	</StrictMode>
	);
