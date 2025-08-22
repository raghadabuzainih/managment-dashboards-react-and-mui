import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Form, Formik, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import users from '../data/users.json'

export const Login = () => {
    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = Yup.object({
        email: Yup.string()
               .email('invalid email')
               .test('exists', "incorrect email" , (value)=> 
                    //wanna check if there is a value && if email (value) is used either by admin or student or instructor (auth)
                    value && (users.find(user => user.email == value) != undefined)
                )
               .required('email is required'),
        password: Yup.string()
                  .test('isCorrect', 'incorrect password', function(value){
                    const {email} = this.parent
                    return value && (users.find(user => user.email == email && user.password == value) != undefined)
                  })
                  .required('password is required')
    })

    return(
        <Container maxWidth="sm">
            <Typography color='primary' variant='h4' fontWeight="fontWeightBold">Log in</Typography>
            <Formik initialValues={initialValues} validationSchema={validationSchema}>
                {({touched, errors, handleBlur, handleChange}) => (
                    <Form>
                        <Grid container spacing={2} direction={'column'}>
                            <TextField 
                                name='email' 
                                label="Email" 
                                variant="outlined"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                            />
                            <TextField 
                                name='password' 
                                label="Password" 
                                variant="outlined"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                            />
                            <Button variant='contained'>Submit</Button>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Container>
    )
}