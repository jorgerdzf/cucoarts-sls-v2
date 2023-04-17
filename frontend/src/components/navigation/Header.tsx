import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import React, { useState } from "react";
import logo from "../../assets/images/logo.png";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 300;
const options = [
  { title: "Tomar accion", to: "takeActions", enabled: true, variant: "outlined" },
  { title: "Ciudades", to: "Cities", enabled: true, variant: "text" },
  { title: "Experiencias", to: "experiences", enabled: true, variant: "text" },
  { title: "Contacto", to: "contact", enabled: true, variant: "text" },
  { title: "Aviso de Privacidad", to: "privacyNotice", enabled: true, variant: "text" },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    logo: {
      maxWidth: 150,
    },
    menuButton: {
      color: "#fff",
    },
  })
);

export default function Header() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Link href="/">
        <img src={logo} alt="Cuco Arts!" />
      </Link>
      <Divider />
      <List key={"mainMenu"}>
        {options.map(
          (item, i) =>
            item.enabled && (
              <ListItem key={i} disablePadding>
                <ListItemButton
                  key={item.to}
                  sx={{ textAlign: "left" }}
                  href={item.to}
                >
                  <ListItemText key={item.title} primary={item.title} />
                </ListItemButton>
              </ListItem>
            )
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        component="nav"
        position="static"
        elevation={0}
        color="transparent"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/">
            <img src={logo} alt="Cuco Arts!" className={classes.logo} />
          </Link>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          ></Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {options.map((option: any, i) => (
              <>
                {option.enabled ?
                  (
                    <Button
                      sx={{ marginLeft: 1 }}
                      key={i}
                      variant={option.variant}
                      href={option.to}
                      size="small"
                      color={option.variant === 'outlined' ? "primary" : "inherit"}
                    >
                      <Typography key={option.title} variant="body2" sx={{ textTransform: 'none' }}>
                        {option.title}
                      </Typography>
                    </Button>
                  ) : (
                    <></>
                  )}
              </>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          key="drawer"
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "#111",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}
