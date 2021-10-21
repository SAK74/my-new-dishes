import { Stack, TextField, Box, Collapse, MenuItem, Slider, Button, Typography } from "@mui/material";
import { useState, useMemo} from 'react';
import {styled} from '@mui/material/styles';
import { useSelector, useDispatch } from "react-redux";
import { addOrder } from "../STORE/store";
import { useHistory } from "react-router";

const CustomField = styled(props => <TextField {...props}
    InputLabelProps = {{shrink: true}}
    required
    helperText = {props.error && 'Please enter correct value'}
/>)(({theme}) =>  ({
    flex: 1,
    [theme.breakpoints.up('md')]: {
        width: 200
    }
}))

const StyledSlider = styled(Slider)(({value}) => {
    const colors = ['#fcfcfc','yellow', '#ffd100', 'orange', '#fe7900', '#ff5b00', '#d14b00', '#fe0000', '#bd0000', '#a50000','#6d0000'];
    return ({
        color: colors[value],
    })
});

export default function StartPage(){
    const {name, preparation_time, type, ...other} = useSelector(state => state.order);
    const [dishes, setDishes] = useState({name, preparation_time, type});
    const [exParams, setExParams] = useState(other);
    const [submited, setSubmited] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const isError = useMemo(() => {
        const temp = {name: !Boolean(dishes.name), preparation_time: !dishes.preparation_time.split(':').some(Number), type: !Boolean(dishes.type)};
        if(dishes.type === 'pizza') return ({...temp, diameter: !Number(exParams.diameter) || exParams.diameter < 0, no_of_slices: !Boolean(exParams.no_of_slices)});
        return dishes.type === 'sandwich' ? ({...temp, slices_of_bread: !Boolean(exParams.slices_of_bread)}) : temp;
    }, [dishes, exParams]);
    
    const handleChange = ev => {
        const handleName = ev.target.name;
        const handleValue = ev.target.value;
        setDishes(prev => ({...prev, [handleName]: handleValue}));
        if (handleName === 'type') {
            let temp;
            if(handleValue === 'pizza') temp = {no_of_slices: 1, diameter: 0}
            else temp = handleValue === 'soup' ? {spiciness_scale: 0} : {slices_of_bread: 1}
            setExParams(temp);
        }                
    }

    const handleExParam = ev => {
        const handleName = ev.target.name;
        let handleValue = ev.target.value;
        if (handleName !== 'diameter') handleValue = Number(handleValue);
        setExParams(prev => ({...prev, [handleName]: handleValue}));
    }
        
    const handleSubmit = ev => {
        ev.preventDefault();
        if (Object.values(isError).some(Boolean)) {
            setSubmited(true);
            return;
        }
        const order = dishes.type === 'pizza' ? {...exParams, diameter: Number(exParams.diameter)} : exParams;
        dispatch(addOrder({...dishes, ...order}));
        history.push('/confirm');
    }

    return(
        <Box component = 'form' onSubmit = {handleSubmit} noValidate
            sx = {{display: 'flex', alignItems: 'center', flexDirection: 'column', p: 3}}
        >
            <Stack direction = 'row' sx = {{justifyContent: 'center'}} spacing = {2}>
                 <CustomField
                    onChange = {handleChange}
                    label = 'Dish name'
                    value = {dishes.name}
                    name = 'name'
                    error = {submited && isError.name}
                />
                <CustomField
                    onChange = {handleChange}
                    label = 'Preparation Time'
                    type = 'time'
                    inputProps = {{step: 1}}
                    value = {dishes.preparation_time}
                    name = 'preparation_time'
                    error = {submited && isError.preparation_time}
                />
                <CustomField
                    onChange = {handleChange}
                    select
                    label = 'Type of dish'
                    value = {dishes.type}
                    name = 'type'
                    error = {submited && isError.type}
                >
                    <MenuItem value = 'pizza'
                        children = 'Pizza'
                    />
                    <MenuItem value = 'soup'
                        children = 'Soup'
                    />
                    <MenuItem value = 'sandwich'
                        children = 'Sandwich'
                    />
                </CustomField>
            </Stack> 
            
            <Collapse
                sx = {{m:3}}
                in = {Boolean(dishes.type)}
                orientation = 'horizontal'
            >
                {dishes.type === 'pizza' && <Box sx = {{'&>*': {mx: 2, mb: 1}}}> 
                    <CustomField
                        onChange = {handleExParam}
                        label = 'Number of slices'
                        inputProps = {{type: 'number', min: '1'}}
                        value = {exParams.no_of_slices}    
                        name = 'no_of_slices'
                        error = {submited && isError.no_of_slices}
                    />
                    <CustomField
                        InputProps = {{endAdornment: 'cm'}}
                        onChange = {handleExParam}
                        label = 'Diameter'
                        value = {exParams.diameter}    
                        name = 'diameter'
                        error = {submited && isError.diameter}
                    />
                </Box>}
                {dishes.type === 'soup' && 
                <Box sx = {{position: 'relative', mt: 3}}>
                    <Typography
                        children = 'Spiciness scale'
                        variant = 'body2'
                        sx = {{
                            position: 'absolute',
                            top: 26
                        }}
                    />
                    <StyledSlider 
                        sx = {{minWidth: '220px'}}
                        valueLabelDisplay = 'on'
                        max = {10}
                        value = {exParams.spiciness_scale}
                        name = 'spiciness_scale'
                        onChange = {handleExParam}
                    />
                </Box>}
                {dishes.type === 'sandwich' && 
                <CustomField
                onChange = {handleExParam}
                inputProps = {{type: 'number', min: '1'}}
                label = 'Number of slices of bread'
                value = {exParams.slices_of_bread}
                name = 'slices_of_bread'
                error = {submited && isError.slices_of_bread}
                />}
            </Collapse>
            <Button
                type = 'submit'
                children = 'Ok'
                variant = 'outlined'
            />
        </Box>
    )
}