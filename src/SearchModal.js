import * as React from "react";
import {Dialog, DialogContent, List, ListItemButton, ListItemText, TextField} from "@mui/material";
const API_BASE_URL = 'http://localhost:58173';

function SearchModal(props) {

    const [query, setQuery] = React.useState('');
    const [searchOptions, setSearchOptions] = React.useState([]);

    const search = (q) => {
        setQuery(q);
        if (q.length < 3) {
            setSearchOptions([]);
            return;
        }
        fetch(`${API_BASE_URL}/Products/Search?q=${q}`)
            .then(resp => resp.json())
            .then(data => setSearchOptions(data))
    }

    return(
        <Dialog open={props.open} onClose={props.close} maxWidth='sm' fullWidth>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Поиск"
                    fullWidth
                    value={query}
                    onChange={(e) =>
                        search(e.target.value)}
                    variant="outlined"
                />
                <List>
                    {searchOptions.map((opt) => (
                        <ListItemButton onClick={() => {props.close(); props.goToProduct(opt.id);}}>
                            <ListItemText
                                primary={opt.title}
                                secondary={`${opt.price} руб.`} />
                        </ListItemButton>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}

export default SearchModal;