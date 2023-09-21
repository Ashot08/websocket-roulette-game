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
import {Link} from "react-router-dom";

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
                                    {props.games && props.games.map((g) => {
                                        return (
                                            <ListItemButton key={'game' + g[0]} sx={{pl: 4}}>
                                                <Link to={'/game/' + g[0]}>
                                                    <ListItemText primary={'Игра ' + g[1].title}/>
                                                </Link>
                                            </ListItemButton>
                                        );
                                    })}

                                </List>
                            </Collapse>

                            <ListItemButton onClick={handleClose}>
                                <ListItemIcon>
                                    <TableBarIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Лобби"/>
                            </ListItemButton>
                            <Link to={'/'}>
                                <ListItemButton onClick={handleClose}>

                                        <ListItemIcon>
                                            <HomeIcon/>
                                        </ListItemIcon>
                                        <ListItemText sx={{color: 'rgba(0, 0, 0, 0.87)'}} primary="Главная"/>

                                </ListItemButton>
                            </Link>
                        </List>

                    </Menu>

                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>

                    </Typography>

                    {props.buttonText === 'Войти'
                    ?
                        <Link to={'/'}>
                            <Button sx={{color: '#fff'}} color="inherit">{props.buttonText}</Button>
                        </Link>
                    :
                        <Button onClick={props.buttonHandler} color="inherit">{props.buttonText}</Button>
                    }


                </Toolbar>
            </AppBar>
        </Box>
    );
}
