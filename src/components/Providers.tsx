'use client';
import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import { LINKS } from '@/consts/links';
import { queryClient } from '@/lib/queryClient';

const theme = createTheme({
  palette: { mode: 'light' }
});

const Providers = ({ children }: PropsWithChildren) => 
  (<QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>Event Scheduling Analysis</Typography>
          <nav>
            <Link href={LINKS.HOME}><a style={{ marginRight: 18 }}>Upload</a></Link>
            <Link href={LINKS.RESULTS}><a>Results</a></Link>
          </nav>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: { xs: 2, md: 4 } }}>
        {children}
      </Box>
    </ThemeProvider>
  </QueryClientProvider>);

export default Providers;
