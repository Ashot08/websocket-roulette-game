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
import QRCode from "react-qr-code";
import {Chip} from "@mui/material";
import {Link} from "react-router-dom";

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
            <DialogTitle sx={{textAlign: 'center'}}>{data?.title}</DialogTitle>
            <List sx={{ pt: 0 }}>

                {data?.content}

                {data?.gameId
                    ?
                    <>
                        <ListItem sx={{p: 2, justifyContent: 'center'}} disableGutters>
                            <div>Идентификатор игры: <Chip variant="outlined" label={data?.gameId} /></div>
                        </ListItem>


                        <ListItem sx={{p: 2, justifyContent: 'center'}} disableGutters>
                            <div>
                                <QRCode value={document.location.origin  + '/game/' + data?.gameId} />
                            </div>
                        </ListItem>
                        <ListItem disableGutters>
                            <ListItemButton
                                autoFocus
                                onClick={() => handleListItemClick('addAccount')}
                            >
                                Ссылка на игру:
                                <Link to={document.location.origin + '/game/' + data.gameId}>
                                    {document.location.origin + '/game/' + data.gameId}
                                </Link>
                            </ListItemButton>
                        </ListItem>
                    </>
                    :
                    ''
                }

            </List>
        </Dialog>
    );
}


