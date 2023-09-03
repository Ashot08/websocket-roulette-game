import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import TableBarIcon from '@mui/icons-material/TableBar';

import {
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Menu,
    MenuItem,
    MenuList
} from "@mui/material";
import {useState} from "react";
import {ExpandLess, ExpandMore, StarBorder} from "@mui/icons-material";

export default function ButtonAppBar(props) {

    const [anchorEl, setAnchorEl] = useState(null);

    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}
                        onClick={handleMenu}
                    >
                        <MenuIcon/>
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >

                        <List
                            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            <ListItemButton onClick={() => {
                                setOpen(!open);
                            }}>
                                <ListItemIcon>
                                    <StarBorder/>
                                </ListItemIcon>
                                <ListItemText primary="Игры"/>
                                {open ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItemButton sx={{pl: 4}}>
                                        <ListItemText primary="Игра 1"/>
                                    </ListItemButton>
                                </List>
                            </Collapse>

                            <ListItemButton onClick={handleClose}>
                                <ListItemIcon>
                                    <TableBarIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Лобби"/>
                            </ListItemButton>
                            <ListItemButton onClick={handleClose}>
                                <ListItemIcon>
                                    <HomeIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Главная"/>
                            </ListItemButton>
                        </List>

                    </Menu>

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>

                    </Typography>

                    <Button onClick={props.buttonHandler} color="inherit">{props.buttonText}</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
