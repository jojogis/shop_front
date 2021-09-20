import * as React from "react";
import {Button, Card, CardActions, CardContent, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";

function Categories(props) {

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
                            <Button onClick={() => props.goToCategory(category.slug)} variant="contained">Посмотреть товары</Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
}
export default Categories;