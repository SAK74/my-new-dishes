import {
  Container, Stepper, Step,
  StepLabel, Paper, AppBar, Toolbar
} from '@mui/material';
import {
  Typography, IconButton, Drawer,
  FormControlLabel, Switch as MuiSwitch, switchClasses
} from '@mui/material';
import { MemoryRouter, Route, Switch } from 'react-router';
import ConfirmPage from './PAGES/confirmPage';
import StartPage from './PAGES/selectPage';
import SummaryPage from './PAGES/summaryPage';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useState, useMemo } from 'react';
import { Settings, LightMode, DarkMode } from '@mui/icons-material';

const Ofset = styled('div')(({ theme }) => theme.mixins.toolbar);

const steps = ['Create order', 'Confirm choice', 'Send request'];

export default function Main() {
  const [step, setStep] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [dark, setDark] = useState(false);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: dark ? 'dark' : 'light'
    }
  }), [dark]);

  const StyledSwitch = styled(MuiSwitch)(({ theme }) => ({
    width: 55,
    [`& .${switchClasses.switchBase}`]: {
      width: 39, height: 38
    }
  }));

  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar>
          <Typography
            variant='h4'
            children="My dishes App"
            sx={{ flex: 1 }} />
          <IconButton
            children={<Settings />}
            onClick={() => setDrawer(true)}
          />
        </Toolbar>
      </AppBar>
      <Ofset />
      <Drawer anchor='right' open={drawer}
        onClose={() => setDrawer(false)} closeAfterTransition
        PaperProps={{ sx: { minWidth: 200 } }}
      >
        <FormControlLabel
          label={!dark ? 'Darken' : 'Lighten'}
          labelPlacement='top'
          checked={dark}
          sx={{ mt: 2, ml: 1 }}
          control={<StyledSwitch
            icon={<LightMode color='primary' />}
            checkedIcon={<DarkMode />}
            onChange={() => setDark(prev => !prev)}
            color='primary'
          />}
        />
      </Drawer>
      <Container maxWidth="md" component={Paper}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>

        <MemoryRouter>
          <Switch>
            <Route exact path='/' render={() => <StartPage />} />
            <Route path='/confirm' render={() => <ConfirmPage />} />
            <Route path='/summary' render={() => <SummaryPage />} />
          </Switch>


          <Route render={({ location }) => {
            setStep(() => {
              switch (location.pathname) {
                case '/confirm': return 1;
                case '/summary': return 2;
                default: return 0;
              }
            })
            return <Stepper
              activeStep={step}
              alternativeLabel
              sx={{ width: '90%', my: 5 }}>
              {steps.map((step, index) => <Step key={index}>
                <StepLabel
                  children={step}
                />
              </Step>)}
            </Stepper>
          }} />
        </MemoryRouter>
      </Container>
    </ThemeProvider>
  );
}
