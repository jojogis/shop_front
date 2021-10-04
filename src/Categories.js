import * as React from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog, DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Add, Delete} from "@mui/icons-material";

const API_BASE_URL = 'http://localhost:58173';

function Categories(props) {

    const [removeConfirmOpen, setRemoveConfirmOpen] = React.useState(false);

    const [categoryToRemove, setCategoryToRemove] = React.useState(false);


    const remove = (id) => {
        fetch(`${API_BASE_URL}/Categories?id=${id}`, {method: 'DELETE'})
            .then(resp => resp.json())
            .then(data => {
                if(data){
                    props.loadCategories();
                }else{
                    setRemoveConfirmOpen(true);
                    setCategoryToRemove(id);
                }
            })
    }

    const forceRemove = () => {
        setRemoveConfirmOpen(false);
        fetch(`${API_BASE_URL}/Categories?id=${categoryToRemove}&deleteNotEmpty=true`,
            {method: 'DELETE'})
            .then(resp => resp.json())
            .then(data => {
                if(data){
                    props.loadCategories();
                }
            })
    }

    return(
        <Grid container spacing={2} sx={{ marginTop: "50px" }}>
            {props.categories?.map((category) => (
                <Grid item xs={4}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {category.title}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button onClick={() => props.goToCategory(category.slug)} variant="contained">
                                Посмотреть товары
                            </Button>
                            <Button variant="contained" color='error' onClick={() => remove(category.id)}>
                                <Delete/>
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
            <Dialog
                open={removeConfirmOpen}
                onClose={() => setRemoveConfirmOpen(false)}
            >
                <DialogTitle id="alert-dialog-title">
                    Удаление категории
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        В данной категории есть товары, вы точно хотите очистить категорию?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color='error' onClick={() => setRemoveConfirmOpen(false)} variant="contained">
                        Отмена
                    </Button>
                    <Button onClick={() => forceRemove()} autoFocus variant="contained">
                        Очистить и удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default Categories;
