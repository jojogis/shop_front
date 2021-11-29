import * as React from "react";
import {Alert, Button, Card, CardActions, CardContent, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import {useEffect} from "react";
import {Delete} from "@mui/icons-material";
const API_BASE_URL = 'http://localhost:58173';

function Products(props) {
    let { id } = useParams();
    const [product, setProduct] = React.useState(null);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    const loadProduct = () => {
        fetch(`${API_BASE_URL}/Products/Get?id=${id}`)
            .then(resp => resp.json())
            .then(data => setProduct(data))
    }

    const buy = (id) => {
        fetch(`${API_BASE_URL}/Products/Buy?id=${id}`,
            {method: 'POST', headers: { "Authorization": "Bearer " + props.token}})
            .then(resp => resp.json())
            .then(data => {
                if(data){
                    loadProduct();
                    setSuccess(true);
                }else{
                    setError(true);
                }
            })
    }

    const remove = (id) => {
        fetch(`${API_BASE_URL}/Products?id=${id}`,
            {method: 'DELETE', headers: { "Authorization": "Bearer " + props.token}})
            .then(resp => resp.json())
            .then(data => {
                if(data){
                    props.goToMain();
                }
            })
    }

    useEffect(() => {
        loadProduct();
    }, [id])

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
            <Grid container justifyContent="center" sx={{marginTop: "100px"}}>
                {product != null ?
                    <Grid item xs={6}>
                        <Card>
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
                                {props.token !== null ?
                                    <Button variant="contained" color='error' onClick={() => remove(product.id)}>
                                        <Delete/>
                                    </Button>
                                    : ''}

                            </CardActions>
                        </Card>
                    </Grid>
                : ''}
            </Grid>
        </div>
    )
}
export default Products;
