import { Backdrop, Button, Card, CardActions, CardHeader, CircularProgress, ListItemText, List, Popover, Box, Stack, Modal, Paper, ListItem, Zoom } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function SummaryPage(){
    const {status, sendedOrders, error} = useSelector(state => state);
    const [openPopover, setOpenPopover] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    
    let renderedList, component, lastOrder, renderHistory = null;

    if(status === 'complete') {
        lastOrder = sendedOrders[sendedOrders.length-1];
        renderedList = Object.entries(lastOrder).map((val, index) => 
        <ListItemText key = {index}
            primary = {val[0] + ':'}
            secondary = {val[1]}
        />);
        renderHistory = sendedOrders.map((order, index) => <Paper key = {index} component = {List}>
            {Object.entries(order).map(val => <ListItem>
                <ListItemText key = {val[0]} sx = {{m:0}}
                    primary = {`${val[0]}:`}
                    secondary = {val[1]}
                />
            </ListItem>)}
        </Paper>);
    }
    
    if (status !== 'pending')
    component = status === 'error' ? <div>
        <Card>
            <CardHeader 
                title = 'Upss... request is failed' 
                subheader = {error}
            />
        </Card>
        <Button component = {Link} to = '/confirm' children = 'please try again ' />
    </div> : <div>
        <Card>
            <CardHeader 
                title = 'You enquiry is sended'
                subheader = {`number of order: ${lastOrder.id}`}
            />
            <CardActions>
                <Box sx = {{flex: 1}}/>
                
                <Button children = 'more info' color = 'inherit' size = 'small'
                    endIcon = {<KeyboardArrowDownIcon/>}
                    onClick = {ev => setOpenPopover(ev.target)}/>
                <Popover
                    open = {Boolean(openPopover)}
                    anchorEl = {openPopover}
                    onClose = {() => setOpenPopover(false)}
                    elevation = {1}
                >
                    <List sx = {{py:2, px: 4}}>
                        {renderedList}
                    </List>
                </Popover>
            </CardActions>
        </Card>
        <Stack direction = 'row' spacing = {7}>
            <Button component = {Link} to = '/' children = 'create new order' />
            <Button children = 'check history' size = 'small' color = 'success'
                onClick = {() => setOpenModal(true)}    
            />
        </Stack>
    </div>;
    
    return (
        <>
            <Backdrop open = {status === 'pending'} children = {<CircularProgress/>}/>
            {component}
            <Modal open = {openModal}
                onClose = {() => setOpenModal(false)}
            >
                <Zoom>
                    <>
                        <Paper children = {renderHistory}
                            sx = {{
                                p: 2,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                '&>*': {m: '5px !important'},
                                maxWidth: '90%',
                                overflow: 'auto'
                            }}
                        />
                        <Button variant = 'contained' color = 'error' onClick = {() => setOpenModal(false)}>
                            close
                        </Button>
                    </>
                </Zoom>
            </Modal>
        </>
    );
}