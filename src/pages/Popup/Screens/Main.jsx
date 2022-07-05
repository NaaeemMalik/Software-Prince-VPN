import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import '../Popup.css';
import Setting from './Setting';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Main = ({ Activate }) => {
  const [open, setOpen] = React.useState(false);
  const [alert, setAlert] = React.useState('error');
  const [message, setMessage] = React.useState('This is an Error Message');
  const [setting, setSetting] = React.useState(false);

  var Server = chrome.runtime;
  var Store = chrome.storage.local;

  const showAlert = (type, message) => {
    setAlert(type);
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="App">
      <Box>
        <Stack direction="row" spacing={20}>
          <Typography
            variant="h3"
            component="div"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textAlign: 'left',
              marginTop: '1rem',
            }}
          >
            MAIN
          </Typography>
          <SettingsOutlinedIcon
            cursor="pointer"
            sx={{ fontSize: '60px', marginTop: '0.75rem !important' }}
            onClick={() => {
              Activate('setting');
            }}
          />
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

export default Main;
