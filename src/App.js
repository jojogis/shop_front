import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import * as React from 'react';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {CssBaseline, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, styled} from "@mui/material";
import {Category, ChevronLeft} from "@mui/icons-material";
import {useEffect} from "react";
import Categories from "./Categories";
import { useHistory } from "react-router-dom";
import Products from "./Products";

const drawerWidth = 240;

const API_BASE_URL = 'http://localhost:58173';

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

function App() {
    const [open, setOpen] = React.useState(false);
    const [categories, setCategories] = React.useState([]);
    const history = useHistory();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const goToCategory = (slug) => {
        history.push(`/${slug}`);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        fetch(`${API_BASE_URL}/Categories`)
            .then(resp => resp.json())
            .then(data => setCategories(data))
    }, [])

    return (
          <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <AppBar position="fixed" open={open}>
                  <Toolbar>
                      <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          onClick={handleDrawerOpen}
                          edge="start"
                          sx={{ mr: 2, ...(open && { display: 'none' }) }}
                      >
                          <MenuIcon />
                      </IconButton>
                      <Typography variant="h6" noWrap component="div">
                          Монитор4ики
                      </Typography>
                  </Toolbar>
              </AppBar>
              <Drawer
                  sx={{
                      width: drawerWidth,
                      flexShrink: 0,
                      '& .MuiDrawer-paper': {
                          width: drawerWidth,
                          boxSizing: 'border-box',
                      },
                  }}
                  variant="persistent"
                  anchor="left"
                  open={open}
              >
                  <DrawerHeader>
                      <IconButton onClick={handleDrawerClose}>
                          <ChevronLeft />
                      </IconButton>
                  </DrawerHeader>
                  <Divider />
                  <List>
                      {[{title: "Главная", slug: ""}, ...categories].map((category, index) => (
                          <ListItem button key={category.title} onClick={() => goToCategory(category.slug)}>
                              <ListItemIcon>
                                  <Category/>
                              </ListItemIcon>
                              <ListItemText
                                  primary={category.title}
                              />
                          </ListItem>
                      ))}
                  </List>
              </Drawer>
              <Main open={open}>
                  <Switch>
                      <Route exact path="/">
                          <Categories
                              categories={categories}
                              goToCategory={goToCategory}
                          />
                      </Route>
                      <Route path="/:category">
                          <Products/>
                      </Route>
                  </Switch>
              </Main>
          </Box>
  );
}

export default App;
