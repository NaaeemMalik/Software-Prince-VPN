import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import './Newtab.css';

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
        backgroundColor: theme.palette.mode === 'dark' ? '#da58fd' : '#da58fd',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#da58fd',
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

const Newtab = ({ data, domainAge, activateState }) => {
  console.log(data, parseInt(domainAge));
  const [formatDate, setFormatDate] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const [popperText, setPopperText] = React.useState('');
  const [activate, setActivate] = React.useState(activateState);
  const [serp, setSerp] = React.useState(data);
  const [Loading, setLoading] = React.useState(activateState);

  var Store = chrome.storage.local;
  var Server = chrome.runtime;

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setPopperText('Copied');
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
    setTimeout(() => {
      setOpen(false);
    }, 1200);
  };

  const extState = (e) => {
    setActivate(e.target.checked);
    Store.set({ activate: e.target.checked });
    if (e.target.checked) {
      fetchData(serp);
      setLoading(true);
    }
  };

  const getDomainAge = (domainAge) => {
    var d = new Date(domainAge).getTime();
    var cd = new Date().getTime();
    var dif = cd - d;
    var years = dif / 31536000000;
    var days = (dif % 31536000000) / 86400000;
    return `${Math.trunc(years)} years, ${Math.trunc(days)} days`;
  };

  const copyDomain = (e) => {
    var copyText = '';
    if (e.target.getAttribute('data-var')) {
      copyText = e.target.getAttribute('data-var');
    } else {
      copyText = e.target.parentElement.getAttribute('data-var');
    }
    navigator.clipboard.writeText(copyText);
  };

  const copyDomains = (e) => {
    var domains = formatDate.map((a) => {
      return a.domain;
    });
    navigator.clipboard.writeText(domains.join('\n'));
    let newPlacement = 'bottom';
    setAnchorEl(e.currentTarget);
    setPopperText('Copied All');
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
    setTimeout(() => {
      setOpen(false);
    }, 1200);
  };

  useEffect(() => {
    if (activateState) {
      fetchData(data);
    }
  }, []);

  const fetchData = async (dt) => {
    var Token = await getDatafromStorage('token');
    Server.sendMessage({ type: 'serp', results: dt, token: Token }, (res) => {
      if (res?.search_id) {
        Server.sendMessage(
          { type: 'getData', token: Token, searchID: res.search_id },
          (resp) => {
            console.log(resp);
            if (resp?.length > 0) {
              formatData(resp, domainAge);
            }
          }
        );
      }
    });
  };

  function getDatafromStorage(str) {
    return new Promise((resolve, reject) => {
      Store.get(str, (res) => {
        if (res[str]) {
          resolve(res[str]);
        } else {
          resolve(null);
        }
      });
    });
  }

  const formatData = (d, da) => {
    var fD = [];
    d.forEach((e, i) => {
      if (e?.domain) {
        var creationDate = e.domain.creation_date;
        if (creationDate) {
          creationDate = new Date(creationDate).getTime();
          console.log(creationDate);
          var dAge = getDomainAge(e.domain.creation_date);
          var totalAge = (Date.now() - creationDate) / 31536000000;
          console.log(totalAge);
          console.log(parseInt(da) < totalAge);
          if (parseInt(da) > totalAge) {
            console.log({
              domain: e.domain.name,
              age: dAge,
              creationDate: e.domain.creation_date,
            });
            fD.push({ domain: e.domain.name, age: dAge, position: e.position });
          }
        }
      }
    });
    console.log(fD);
    setLoading(false);
    setFormatDate(fD);
  };
  return (
    <div className="App">
      <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <Typography sx={{ p: 2 }}>{popperText}</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Card sx={{ width: 369, border: '1px solid gray' }}>
        <CardContent sx={{ textAlign: 'left' }}>
          <Stack direction={'row'} sx={{ justifyContent: 'space-between' }}>
            <Stack direction={'row'}>
              <Typography
                sx={{ fontSize: 22, fontWeight: 'bolder' }}
                color="text.secondary"
                gutterBottom
              >
                Keyword Zebra
              </Typography>
              <IOSSwitch
                sx={{ marginTop: '0.25rem', marginLeft: '0.5rem' }}
                checked={activate}
                onChange={extState}
              />
            </Stack>
            <Stack direction={'row'} spacing={2}>
              <Typography>Copy All</Typography>
              <ContentCopyIcon
                onClick={copyDomains}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
          </Stack>
          {activate ? (
            Loading ? (
              <Box sx={{ textAlign: 'center', marginTop: '1rem' }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {formatDate.length > 0 ? (
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor: 'lightgray',
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}
                    >
                      {formatDate.length} sites found
                    </Typography>
                  </Box>
                ) : (
                  <></>
                )}
                <List
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    maxHeight: '358px',
                    overflow: 'auto',
                  }}
                >
                  {formatDate.length > 0 ? (
                    formatDate.map((e, i) => {
                      return (
                        <ListItem
                          key={i}
                          data-var={e.domain}
                          button
                          divider
                          onClick={copyDomain}
                        >
                          <ListItemText
                            data-var={e.domain}
                            primary={e.position.toString() + '.'}
                            sx={{ width: '2rem', wordBreak: 'break-word' }}
                          />
                          <ListItemText
                            data-var={e.domain}
                            primary={e.domain}
                            sx={{ width: '10rem', wordBreak: 'break-word' }}
                          />
                          <ListItemAvatar data-var={e.domain}>
                            <ContentCopyIcon
                              data-var={e.domain}
                              onClick={handleClick('bottom')}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            data-var={e.domain}
                            primary={e.age}
                            sx={{ textAlign: 'right', width: '5.5rem' }}
                          />
                        </ListItem>
                      );
                    })
                  ) : (
                    <Typography>
                      No Domain is Available with Age less than{' '}
                      {domainAge.toString()} Years
                    </Typography>
                  )}
                </List>
              </>
            )
          ) : (
            <></>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Newtab;
