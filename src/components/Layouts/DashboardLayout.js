/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import {
  AppBar as MuiAppBar,
  Box,
  Breadcrumbs,
  Button,
  CssBaseline,
  Divider,
  Drawer as MuiDrawer,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Home,
  People,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExitToApp,
} from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { UserContext } from "../../context/userContext";
import { useLocation, useNavigate } from "react-router";
import { getAuth } from "firebase/auth";

const drawerWidth = 240;

const logo = require("../../assets/logo_with_bg.png");

const list = [
  { label: "Laman Utama", url: "/laman-utama", icon: Home },
  { label: "Ahli", url: "/senarai-ahli", icon: People },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => {
  return {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  };
};

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#fff",
  color: "#000",
  borderBottom: "1px solid #e0e0e0",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// ==============================================================================================
// MAIN =========================================================================================
// ==============================================================================================
export default function DashboardLayout({ title, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const appBarRef = React.useRef();
  const drawerRef = React.useRef();

  const { user, signOut } = React.useContext(UserContext);

  const [open, setOpen] = React.useState(false);
  const [selectedDrawerItem, setSelectedDrawerItem] = React.useState(list[0]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [appbarHeight, setAppbarHeight] = React.useState(64);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
  };

  const renderListItem = (item, index) => {
    const { label, url, icon: Icon } = item;
    const selected = location.pathname === url;
    return (
      <ListItem key={label} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          onClick={() => {
            setSelectedDrawerItem(item);
            navigate(url);
          }}
          selected={selected}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            <Icon />
          </ListItemIcon>
          <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    );
  };

  React.useEffect(() => {
    if (appBarRef?.current) {
      if (appBarRef?.current?.offsetHeight > 0)
        setAppbarHeight(appBarRef.current.offsetHeight);
    }
  }, [appBarRef?.current?.offsetHeight]);

  React.useEffect(() => {
    const manageLocationChange = (loc) => {
      const drawerItem = list.find((item) => item.url === loc.pathname);

      if (drawerItem) {
        setSelectedDrawerItem(drawerItem);
      } else {
        setSelectedDrawerItem(list[0]);
      }
    };

    manageLocationChange(location);
  }, [JSON.stringify(location)]);

  const name = user
    ? user?.displayName ||
      (user?.email && user?.email?.substring(0, user?.email?.indexOf("@")))
    : "Admin";

  return (
    <div>
      <CssBaseline />
      <AppBar ref={appBarRef} position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bolder" }}
          >
            Pertubuhan Pribumi Perkasa Malaysia
          </Typography>

          <div>
            <Button
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              startIcon={<AccountCircle />}
              variant="outlined"
              sx={{
                textTransform: "none",
              }}
            >
              {name}
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                marginTop: "30px",
              }}
            >
              <MenuItem onClick={handleLogout} sx={{ minWidth: "200px" }}>
                <ExitToApp sx={{ marginRight: "10px" }} fontSize="small" />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        ref={drawerRef}
        variant="permanent"
        open={open}
        sx={{ display: "flex", flexDirection: "column" }}
      >
        <DrawerHeader>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              alt=""
              src={logo}
              style={{ backgroundColor: "red", height: "40px" }}
            />
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <List sx={{ margin: "0 0 0", flex: 1 }}>
          {list.map(renderListItem)}
        </List>
        {/* <Divider /> */}
        {open && (
          <Typography sx={{ color: "#dddddd", textAlign: "center" }}>
            {process.env.REACT_APP_VERSION}
          </Typography>
        )}
      </Drawer>
      <div
        style={{
          display: "flex",
          flex: 1,
          paddingTop: `${appbarHeight + 20}px`,
          paddingLeft: open ? "260px" : "77px",
          paddingRight: "20px",
          paddingBottom: "10px",
        }}
      >
        <div
          style={{
            width: "100%",
            position: "relative",
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              sx={{ display: "flex", alignItems: "center" }}
              color="inherit"
              href={location.pathname}
            >
              <Home sx={{ mr: 0.5 }} fontSize="inherit" />
              {selectedDrawerItem.label}
            </Link>
          </Breadcrumbs>
          <div style={{ flex: 1 }}>
            <Divider sx={{ margin: "20px 0" }} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
