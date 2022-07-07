import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button, Navbar, Container } from 'react-bootstrap';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Setting from './Setting';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'; // <-- import styles to be used
import '../Popup.css';

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
      <Navbar>
        <Container>
          <Navbar.Brand href="#home">
            {' '}
            <img
              alt=""
              src="logo_new_white.png"
              width="160"
              height="30"
              className="d-inline-block align-top"
            />{' '}
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text className="headerfont">
              <a href="#login">
                <FontAwesomeIcon className="fa-cog" icon={solid('rotate')} />
              </a>{' '}
              <a href="#login">
                <FontAwesomeIcon className="fa-cog" icon={solid('gear')} />
              </a>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
