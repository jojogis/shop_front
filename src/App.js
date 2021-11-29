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
import {
    Autocomplete,
    Button,
    CssBaseline,
    Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText, MenuItem,
    styled, TextField
} from "@mui/material";
import {
    Category,
    ChevronLeft,
    PlusOne,
    Add,
    VerifiedUserOutlined,
    AccountCircle,
    Logout,
    SearchRounded
} from "@mui/icons-material";
import {useEffect} from "react";
import Categories from "./Categories";
import { useHistory } from "react-router-dom";
import Products from "./Products";
import SearchModal from "./SearchModal";
import Product from "./Product";

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
    const [newCatName, setNewCatName] = React.useState(null);
    const [newCatUrl, setNewCatUrl] = React.useState(null);
    const [addCategoryOpen, setAddCategoryOpen] = React.useState(false);
    const [addProductOpen, setAddProductOpen] = React.useState(false);
    const [newProductPrice, setNewProductPrice] = React.useState(null);
    const [newProductName, setNewProductName] = React.useState(null);
    const [newProductWeight, setNewProductWeight] = React.useState(null);
    const [newProductStock, setNewProductStock] = React.useState(null);
    const [newProductCat, setNewProductCat] = React.useState(null);
    const [authModalOpen, setAuthModalOpen] = React.useState(false);
    const [login, setLogin] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [errorAuth, setErrorAuth] = React.useState(false);
    const [token, setToken] = React.useState(null);
    const [showSearch, setShowSearch] = React.useState(false);
    const history = useHistory();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const goToCategory = (slug) => {
        history.push(`/${slug}`);
    }

    const goToProduct = (id) => {
        history.push(`/product/${id}`);
    }

    const goToMain = () => {
        history.push(`/`);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const loadCategories = () => {
        fetch(`${API_BASE_URL}/Categories`)
            .then(resp => resp.json())
            .then(data => setCategories(data))
    }

    const auth = () => {
        fetch(`${API_BASE_URL}/Login?login=${login}&pass=${password}`,
            {method: 'POST'})
            .then(resp => resp.text())
            .then(data => {
                console.log(data);
                if (data.length > 0) {
                    setAuthModalOpen(false);
                    setToken(data);
                    setErrorAuth(false);
                } else {
                    setErrorAuth(true);
                }

            })
    }

    const logout = () => {
        fetch(`${API_BASE_URL}/Logout`,
            {method: 'POST', headers: { "Authorization": "Bearer " + token}})
            .then(resp => resp.json())
            .then(data => {
                if (data) {
                    setToken(null);
                }
            })
    }

    const createCategory = () => {
        setAddCategoryOpen(false);
        fetch(`${API_BASE_URL}/Categories?Name=${newCatName}&Slug=${newCatUrl}`,
            {method: 'PUT', headers: { "Authorization": "Bearer " + token}})
            .then(resp => resp.json())
            .then(() => loadCategories())
    }
    const createProduct = () => {
        setAddProductOpen(false);
        fetch(`${API_BASE_URL}/Products?title=${newProductName}
        &price=${newProductPrice}
        &weight=${newProductWeight}
        &stock=${newProductStock}
        &categoryId=${newProductCat}`,
            {method: 'PUT', headers: { "Authorization": "Bearer " + token}})
            .then(resp => resp.json())
            .then(() => loadCategories())
    }


    useEffect(() => {
        loadCategories();
    }, [])

    return (
          <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <AppBar position="fixed" open={open}>
                  <Toolbar
                    style={{width: '100%', justifyContent: 'space-between'}}
                  >
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
                      <div>
                          <IconButton
                              color="inherit"
                              aria-label="open drawer"
                              onClick={() => setShowSearch(true)}
                              edge="end"
                              sx={{ mr: 2 }}
                          >
                              <SearchRounded />
                          </IconButton>
                          {showSearch ?
                              <SearchModal
                                  open={showSearch}
                                  close={() => setShowSearch(false)}
                                  goToProduct={goToProduct}
                              />
                              : ''}
                          {token == null ?
                              <IconButton
                                  color="inherit"
                                  aria-label="open drawer"
                                  onClick={() => setAuthModalOpen(true)}
                                  edge="end"
                              >
                                  <AccountCircle />
                              </IconButton>
                              :
                              <IconButton
                                  color="inherit"
                                  aria-label="open drawer"
                                  onClick={() => logout()}
                                  edge="end"
                              >
                                  <Logout />
                              </IconButton>
                          }
                      </div>
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
                  <Divider />
                  {token !== null ?
                      <List>
                          <ListItem button key={1} onClick={() => setAddCategoryOpen(true)}>
                              <ListItemIcon>
                                  <Add/>
                              </ListItemIcon>
                              <ListItemText primary="Добавить категорию"/>
                          </ListItem>
                          <ListItem button key={1} onClick={() => setAddProductOpen(true)}>
                              <ListItemIcon>
                                  <Add/>
                              </ListItemIcon>
                              <ListItemText primary="Добавить продукт"/>
                          </ListItem>
                      </List>
                      : ''}

              </Drawer>
              <Main open={open}>
                  <Switch>
                      <Route exact path="/">
                          <Categories
                              categories={categories}
                              goToCategory={goToCategory}
                              loadCategories={loadCategories}
                              token={token}
                          />
                      </Route>
                      <Route path="/product/:id">
                          <Product token={token} goToMain={goToMain}/>
                      </Route>
                      <Route path="/:category">
                          <Products token={token}/>
                      </Route>
                  </Switch>
              </Main>
              <Dialog open={addCategoryOpen} onClose={() => setAddCategoryOpen(false)}>
                  <DialogTitle>Добавить категорию</DialogTitle>
                  <DialogContent>
                      <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Имя"
                          fullWidth
                          required
                          value={newCatName}
                          onChange={(e) =>
                              setNewCatName(e.target.value)}
                          variant="standard"
                      />
                      <TextField
                          autoFocus
                          margin="dense"
                          id="url"
                          label="Url"
                          fullWidth
                          value={newCatUrl}
                          onChange={(e) =>
                              setNewCatUrl(e.target.value)}
                          required
                          variant="standard"
                      />
                  </DialogContent>
                  <DialogActions>
                      <Button variant="contained" onClick={() => createCategory()}>Добавить</Button>
                  </DialogActions>
              </Dialog>
              <Dialog open={addProductOpen} onClose={() => setAddProductOpen(false)}>
                  <DialogTitle>Добавить продукт</DialogTitle>
                  <DialogContent>
                      <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Имя"
                          fullWidth
                          required
                          value={newProductName}
                          onChange={(e) =>
                              setNewProductName(e.target.value)}
                          variant="standard"
                      />
                      <TextField
                          autoFocus
                          margin="dense"
                          id="price"
                          label="Цена"
                          fullWidth
                          type="number"
                          value={newProductPrice}
                          onChange={(e) =>
                              setNewProductPrice(e.target.value)}
                          required
                          variant="standard"
                      />
                      <TextField
                          autoFocus
                          margin="dense"
                          id="weight"
                          label="Вес"
                          fullWidth
                          type="number"
                          value={newProductWeight}
                          onChange={(e) =>
                              setNewProductWeight(e.target.value)}
                          required
                          variant="standard"
                      />
                      <TextField
                          autoFocus
                          margin="dense"
                          id="stock"
                          label="Наличие"
                          fullWidth
                          type="number"
                          value={newProductStock}
                          onChange={(e) =>
                              setNewProductStock(e.target.value)}
                          required
                          variant="standard"
                      /><br/>
                      <TextField
                          id="outlined-select-currency"
                          select
                          margin="dense"
                          label="Категория"
                          value={newProductCat}
                          fullWidth
                          variant="standard"
                          onChange={(e) =>
                              setNewProductCat(e.target.value)}
                      >
                          {categories.map((cat) => (
                              <MenuItem key={cat.id} value={cat.id}>
                                  {cat.title}
                              </MenuItem>
                          ))}
                      </TextField>
                  </DialogContent>
                  <DialogActions>
                      <Button variant="contained" onClick={() => createProduct()}>Добавить</Button>
                  </DialogActions>
              </Dialog>
              <Dialog
                  open={authModalOpen}
                  onClose={() => setAuthModalOpen(false)}
              >
                  <DialogTitle id="alert-dialog-title">
                      Авторизация
                  </DialogTitle>
                  <DialogContent>
                      <TextField
                          autoFocus
                          margin="dense"
                          id="login"
                          label="Логин"
                          fullWidth
                          type="text"
                          value={login}
                          error={errorAuth}
                          onChange={(e) =>
                              setLogin(e.target.value)}
                          required
                          variant="standard"
                      />
                      <TextField
                          autoFocus
                          margin="dense"
                          id="password"
                          label="Пароль"
                          fullWidth
                          type="password"
                          value={password}
                          error={errorAuth}
                          onChange={(e) =>
                              setPassword(e.target.value)}
                          required
                          variant="standard"
                      />
                  </DialogContent>
                  <DialogActions>
                      <Button color='success' onClick={() => auth()} variant="contained">
                          Войти
                      </Button>
                  </DialogActions>
              </Dialog>
          </Box>
  );
}

export default App;
