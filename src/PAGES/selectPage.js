import {
    Stack, TextField, Box, Collapse,
    MenuItem, Slider, Button, Typography
} from "@mui/material";
import { styled } from '@mui/material/styles';
import { useSelector, useDispatch } from "react-redux";
import { addOrder } from "../STORE/store";
import { useHistory } from "react-router";
import { Form, Field } from "react-final-form";

const CustomField = styled(props => <Field {...props}
    parse={props.type === 'number' ? value => Number(value) : undefined}
    render={({ meta, input, ...rest }) => <TextField {...rest}
        inputProps={{ ...input, ...rest.inputProps }}
        InputLabelProps={{ shrink: true }}
        required
        error={meta.invalid && meta.touched}
        helperText={meta.invalid && meta.touched && meta.error}
    />}
/>)(({ theme }) => ({
    flex: 1,
    [theme.breakpoints.up('md')]: {
        width: 200
    }
}));

const StyledSlider = styled(Slider)(({ value }) => {
    const colors = ['yellow', '#ffd100', 'orange', '#fe7900',
        '#ff5b00', '#d14b00', '#fe0000', '#bd0000', '#a50000', '#6d0000'];
    return ({
        color: colors[value - 1]
    })
});

export default function StartPage() {
    const { name, preparation_time, type, ...other } = useSelector(state => state.order);
    const dispatch = useDispatch();
    const history = useHistory();

    const onSubmit = values => {
        if (values.type === 'pizza') values = { ...values, diameter: Number(values.diameter) };
        dispatch(addOrder(values));
        history.push('/confirm');
    }
    const checkFills = value => value ? undefined : "Fill this field";
    const checkNaN = value => isNaN(value) ? "Value must be a number" : undefined;
    const combineCheck = value =>
        [checkFills, checkNaN].reduce((error, validator) => error || validator(value), undefined);

    // initialize form with ex parameters (dependently with type of dish)
    const handleTypeChange = initialize => ({ target: { value } }) => {
        const newParam = value === 'pizza' ? { no_of_slices: 1, diameter: 0 } :
            value === 'soup' ? { spiciness_scale: 1 } : { slices_of_bread: 1 };
        initialize(({ name, preparation_time, type }) => ({
            name, preparation_time, type, ...newParam
        }));
    }

    return (
        <Form onSubmit={onSubmit}
            // subscription = {{values: true, modified: true}}
            initialValues={{ name, preparation_time, type, ...other }}
            render={({ handleSubmit, values, form, ...rest }) => {
                return <Box
                    component='form' onSubmit={handleSubmit} noValidate
                    sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', p: 3 }}
                >
                    <Stack direction='row' sx={{ justifyContent: 'center' }} spacing={2}>
                        <CustomField
                            name='name'
                            validate={checkFills}
                            label='Dish name'
                        />
                        <CustomField
                            name='preparation_time'
                            validate={value =>
                                value.split(":").some(Number) ? undefined : "Time can't be zero"}
                            type='time'
                            inputProps={{ step: 1 }}
                            label='Preparation Time'
                        />
                        <CustomField
                            name='type'
                            validate={checkFills}
                            label='Type of dish'
                            select
                            onChange={handleTypeChange(form.initialize)}
                        >
                            <MenuItem value='pizza' children='Pizza' />
                            <MenuItem value='soup' children='Soup' />
                            <MenuItem value='sandwich' children='Sandwich' />
                        </CustomField>
                    </Stack>
                    <Collapse
                        sx={{ m: 3 }}
                        in={!!values.type}
                        orientation='horizontal'
                    >
                        {values.type === 'pizza' &&
                            <Box sx={{ '&>*': { mx: 2, mb: 1 } }}>
                                <CustomField
                                    name='no_of_slices'
                                    validate={checkFills}
                                    type='number'
                                    label='Number of slices'
                                    inputProps={{ min: '1' }}
                                />
                                <CustomField
                                    name='diameter'
                                    validate={combineCheck}
                                    label='Diameter'
                                    InputProps={{ endAdornment: 'cm' }}
                                />
                            </Box>}
                        {values.type === 'soup' &&
                            <Box sx={{ position: 'relative', mt: 3 }}>
                                <Typography
                                    children='Spiciness scale'
                                    variant='body2'
                                    sx={{
                                        position: 'absolute',
                                        top: 26
                                    }}
                                />
                                <Field
                                    name='spiciness_scale'
                                    render={({ input }) => <StyledSlider
                                        sx={{ minWidth: '220px' }}
                                        valueLabelDisplay='on'
                                        min={1}
                                        max={10}
                                        value={input.value}
                                        onChange={input.onChange}
                                    />}
                                />
                            </Box>}
                        {values.type === 'sandwich' &&
                            <CustomField
                                name='slices_of_bread'
                                type='number'
                                validate={checkFills}
                                inputProps={{ min: '1' }}
                                label='Number of slices of bread'
                            />}
                    </Collapse>
                    <Stack direction='row' sx={{ justifyContent: 'center' }} spacing={6}>
                        <Button children="reset all" variant='outlined'
                            disabled={rest.pristine}
                            onClick={() => form.reset({
                                name: "",
                                preparation_time: "00:00:00",
                                type: ''
                            })}
                        />
                        <Button
                            type='submit'
                            children='Ok'
                            variant='outlined'
                            disabled={rest.hasValidationErrors}
                        />
                    </Stack>
                </Box>
            }
            }
        />
    )
}