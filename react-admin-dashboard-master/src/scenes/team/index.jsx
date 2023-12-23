import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import { useState , useEffect} from "react";
const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [bookings,setBookings] = useState([]);
    useEffect(() => {
    axios.get('/allbookings').then(response => {
      setBookings(response.data);
      
    });
  }, []);
   
  return (
    
      <Box
          gridColumn="span 12"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  borderBottom={`4px solid ${colors.primary[500]}`}
  colors={colors.grey[100]}
  p="15px"
>
  <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
    Historique des locations
  </Typography>
</Box>
{bookings.map((booking, i) => (
  <Box
    key={`${booking._id}-${i}`}
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    borderBottom={`4px solid ${colors.primary[500]}`}
    p="15px"
  >
    <Box>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        client :
        {booking?.user.nom} {booking?.user.prenom} / {booking?.user.phone}
      </Typography>
      <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
        chauffeur :
        {booking?.chauffeur.nom} {booking?.chauffeur.prenom} / {booking?.chauffeur.phone}
      </Typography>
      <Typography color={colors.grey[100]}>
        {booking?.ride.departureTime} 
      </Typography>
    </Box>
    
  <Box color={colors.grey[100]}>
    {booking?.ride.startingLocation} {'=>'} {booking?.ride.destination} 
  </Box>

    
    <Typography
        color={colors.greenAccent[500]}
        variant="h5"
        fontWeight="600"
      >
       
      </Typography>
    <Box
      backgroundColor={colors.greenAccent[500]}
      p="5px 10px"
      borderRadius="4px"
    >
      {booking?.price}DA
    </Box>
  </Box>
))}

        </Box>
        
  );
};

export default Team;
