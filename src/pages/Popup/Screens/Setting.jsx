import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import '../Popup.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const Setting = ({ Activate }) => {
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState('error');
  const [message, setMessage] = React.useState('This is an Error Message');
  const [domainAge, setDomainAge] = React.useState(3);

  var Server = chrome.runtime;
  var Store = chrome.storage.local;

  useEffect(async () => {
    var domainAge = await getDatafromStorage('domainAge');
    if (domainAge) {
      setDomainAge(domainAge);
    } else {
      setDomainAge(3);
      Store.set({ domainAge: 3 });
    }
  }, []);

  const getDatafromStorage = (str) => {
    return new Promise((resolve, reject) => {
      Store.get(str, (res) => {
        if (res[str]) {
          resolve(res[str]);
        } else {
          resolve(null);
        }
      });
    });
  };

  const showAlert = (type, message) => {
    setAlert(type);
    setMessage(message);
    setOpen(true);
  };

  const handleChange = (event) => {
    setDomainAge(event.target.value);
    Store.set({ domainAge: event.target.value });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const logOut = async () => {
    var userid = await getDatafromStorage('userid');
    if (!userid) {
      console.log('userid not found');
      return;
    }
    Store.set({ userid: null }, () => {
      Activate('login');
    });
  };
  return (
    <div className="App">
      <Box>
        <Stack direction="row" spacing={10}>
          <Typography
            variant="h3"
            component="div"
            gutterBottom
            sx={{ fontWeight: 'bold', textAlign: 'left', marginTop: '1rem' }}
          >
            SETTING
          </Typography>
          <ExitToAppIcon
            cursor="pointer"
            sx={{ fontSize: '60px', marginTop: '0.75rem !important' }}
            onClick={() => {
              Activate('main');
            }}
          />
        </Stack>
        <Stack>
          <FormControl fullWidth>
            <InputLabel id="domainAge">Domain Age</InputLabel>
            <Select
              labelId="domainAge"
              id="domainAgeSelect"
              defaultValue="1 Year"
              value={domainAge}
              label="Domain Age"
              onChange={handleChange}
            >
              <MenuItem value={1}>1 Year</MenuItem>
              <MenuItem value={2}>2 Year</MenuItem>
              <MenuItem value={3}>3 Year</MenuItem>
              <MenuItem value={4}>4 Year</MenuItem>
              <MenuItem value={5}>5 Year</MenuItem>
            </Select>
          </FormControl>
          {/* <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
            label="Activate"
            sx={{ justifyContent: 'center', marginTop: '1rem' }}
          /> */}
          <Button
            color="error"
            variant="contained"
            onClick={logOut}
            sx={{
              position: 'absolute',
              bottom: '15px',
              width: '94.5%',
              fontWeight: 'bold',
              height: '2.5rem',
            }}
          >
            Logout
          </Button>
        </Stack>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alert} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Setting;
