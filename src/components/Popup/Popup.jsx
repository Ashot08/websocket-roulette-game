import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import AddIcon from '@mui/icons-material/Add';


export default function Popup (props) {
    const { onClose, data, open } = props;

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{textAlign: 'center'}}>{data.title}</DialogTitle>
            <List sx={{ pt: 0 }}>

                {data.content}

                <ListItem sx={{p: 2}} disableGutters>
                    <div>Идентификатор игры: {data.gameId}</div>
                </ListItem>

                <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick('addAccount')}
                    >
                        Ссылка на игру: <a href={'/game/' + data.gameId}>/game/{data.gameId}</a>
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}


