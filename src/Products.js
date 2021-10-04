import * as React from "react";
import {Alert, Button, Card, CardActions, CardContent, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import {useEffect} from "react";
import {Delete} from "@mui/icons-material";
const API_BASE_URL = 'http://localhost:58173';

function Products(props) {
    let { category } = useParams();
    const [products, setProducts] = React.useState([]);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    const loadProducts = () => {
        fetch(`${API_BASE_URL}/Products?categorySlug=${category}`)
            .then(resp => resp.json())
            .then(data => setProducts(data))
    }

    const buy = (id) => {
        fetch(`${API_BASE_URL}/Products/Buy?id=${id}`, {method: 'POST'})
            .then(resp => resp.json())
            .then(data => {
                if(data){
                    setSuccess(true);
                    loadProducts();
                }else{
                    setError(true);
                }
            })
    }

    const remove = (id) => {
        fetch(`${API_BASE_URL}/Products?id=${id}`, {method: 'DELETE'})
            .then(resp => resp.json())
            .then(data => {
                if(data){
                    loadProducts();
                }
            })
    }

    useEffect(() => {
        loadProducts();
    }, [category])

    return(
        <div style={{ marginTop: "50px" }}>
            {success ? <Alert variant="filled"
                              severity="success"
                              onClose={() => setSuccess(false)}>
                Продукт успешно куплен
            </Alert> : ""}
            {error ? <Alert variant="filled"
                              severity="error"
                              onClose={() => setError(false)}>
                При покупке произошла ошибка
            </Alert> : ""}
            <Grid container spacing={2} sx={{marginTop: "10px"}}>
                {products?.map((product) => (
                    <Grid item xs={4}>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {product.title}
                                </Typography>
                                <Typography color="text.primary" variant="p">
                                    В наличии: {product.stock} шт.
                                </Typography>
                                <br/>
                                <Typography color="text.primary" variant="p">
                                    Вес: {product.weight} г.
                                </Typography>
                                <br/>
                                <Typography color="text.primary" variant="p">
                                    Цена: {product.price} руб.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button disabled={product.stock === 0}
                                        onClick={() => buy(product.id)}
                                        variant="contained"
                                >
                                    Купить
                                </Button>
                                <Button variant="contained" color='error' onClick={() => remove(product.id)}>
                                    <Delete/>
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                ))}
            </Grid>
        </div>
    )
}
export default Products;
