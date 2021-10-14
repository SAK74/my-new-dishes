import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { Button, List, ListItemText, Paper, Stack } from '@mui/material';
import { sendRequest } from '../STORE/store';

export default function ConfirmPage(){
    const state = useSelector(state => state.order);
    const dispatch = useDispatch();
    const history = useHistory();
    const renderState = Object.entries(state).map((val, index) => 
        <ListItemText
            key = {index} 
            sx = {{px: 2}}
            primary = {val[0] + ':'} 
            secondary = {val[1]}
        />);

    const handleClick = () => {
        dispatch(sendRequest());
        history.push('/summary');
    }

    return (
        <>
        <Paper component = {List} sx = {{minWidth: 300 }}>
            {renderState}  
        </Paper>
        <Stack direction = 'row' sx = {{width: '50%', justifyContent: 'space-between', my: 2}}>
            <Button
                component = {Link}
                to = '/'
                children = 'back'
            />
            <Button
                children = 'next'
                onClick = {handleClick}
            />
        </Stack>
        </>
    );
}