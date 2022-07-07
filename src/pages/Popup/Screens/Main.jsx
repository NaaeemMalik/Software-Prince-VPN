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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import '../Popup.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const refresh = () => {
  window.location.reload(false);
};

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
  const getServersGroup = () => {
    Server.sendMessage({ type: 'getServersGroup' }, (res) => {
      console.log(res);
    });
  };
  getServersGroup();

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
              <Button className="bgnone" onClick={refresh}>
                <FontAwesomeIcon className="fa-cog" icon={solid('rotate')} />
              </Button>{' '}
              <Button
                className="bgnone"
                onClick={() => {
                  Activate('setting');
                }}
              >
                <FontAwesomeIcon className="fa-cog" icon={solid('gear')} />
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Box>
        <Stack direction="row" spacing={20}>
          <FormControl fullWidth>
            <InputLabel id="domainAge">Domain Age</InputLabel>
            <Select
              labelId="domainAge"
              id="domainAgeSelect"
              label="Domain Age"
              // onChange={handleChange}
            >
              <MenuItem value={1}>1 Year</MenuItem>
              <MenuItem value={2}>2 Year</MenuItem>
              <MenuItem value={3}>3 Year</MenuItem>
              <MenuItem value={4}>4 Year</MenuItem>
              <MenuItem value={5}>5 Year</MenuItem>
            </Select>
          </FormControl>
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
