import { Box, IconButton, Badge, useTheme, Popover, List, ListItem, ListItemText } from "@mui/material";
import { useContext , useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import axios from 'axios';
import styled from "styled-components";
import tw from 'twin.macro';
import { Link } from "react-router-dom";
const SLink = styled(Link)`


  text-decoration:none;
  color: white;
 
  
 

  
`;

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/adminnotifications');
        const data = response.data;
        setNotifications(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

 

  const handleNotificationClose = () => {
    setAnchorEl(null);
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const handleNotificationClick = async (event) => {
    setAnchorEl(event.currentTarget);
    const unreadNotifications = notifications.filter(notification => !notification.isRead);
    if (unreadNotifications.length > 0) {
      try {
        await Promise.all(unreadNotifications.map(notification =>
          axios.put(`/adminnotifications/${notification._id}/read`)
        ));
        setNotifications(prevNotifications =>
          prevNotifications.map(prevNotification =>
            unreadNotifications.find(notification => notification._id === prevNotification._id)
              ? { ...prevNotification, isRead: true }
              : prevNotification
          )
        );
        
      } catch (err) {
        console.error(err);
      }
    }
  };
  

  
  
  
  const open = Boolean(anchorEl);
  const hasUnreadNotifications = notifications.some(notification => !notification.isRead);
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleNotificationClick}>
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>
        <Popover
  open={open}
  anchorEl={anchorEl}
  onClose={handleNotificationClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
>
  <Box p={2}>
    {notifications.length > 0 ? (
      <List>
        {notifications.map(notification => (
          <SLink key={notification._id} to="/faq">
            <ListItemText primary={notification.message} secondary={notification.timestamp} />
          </SLink>
        ))}
      </List>
    ) : (
      <Box textAlign="center">Vous n'avez pas de notifications</Box>
    )}
  </Box>
</Popover>
        
      </Box>
    </Box>
  );
};

export default Topbar;
