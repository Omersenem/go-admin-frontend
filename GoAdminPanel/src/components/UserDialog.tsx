// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import {useForm, Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {useEffect, useState} from "react";
import Autocomplete from "@mui/material/Autocomplete";

// Validation Schema
const schema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  role: yup.object().nullable()
})

interface UserDialogProps {
  open: boolean
  handleClose: () => void
  variant: string
  data?: {
    id:number
    first_name: string
    last_name: string
    email: string
    role: {
      id: number
      name: string
    }
  }
}

const UserDialog = (prop: UserDialogProps) => {
  const {open, handleClose, variant, data}=prop
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: data || {
      id:0,
      first_name: '',
      last_name: '',
      email: '',
      role: null
    }
  })
  const [roles, setRoles] = useState([])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (formData: any) => {
    console.log(formData);
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      role_id: formData.role.id,
    };

    const createUser = async () => {
      try {
        const url = 'http://localhost:8080/api/users';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        const data = await response.json();
        console.log('Response:', data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateUser = async () => {
      try {
        const userId = data?.id; // Ensure data is available here
        const url = `http://localhost:8080/api/users/${userId}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        const responseData = await response.json();
        console.log('Response:', responseData);
      } catch (error) {
        console.error('Fetch error:', error);
      }}
    if(variant==='create'){
      createUser();
    } else {
      updateUser()
    }

    handleClose();
  };

    // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const url = 'http://localhost:8080/api/roles';
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchRoles();
  }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    reset(data)
  }, [data, reset])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>
        Kullanıcı {variant === 'create' ? 'Ekle' : 'Güncelle'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name='first_name'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label='İsim'
                error={!!errors.first_name}
                helperText={errors.first_name?.message}
                fullWidth
                margin='dense'
              />
            )}
          />
          <Controller
            name='last_name'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label='Soyisim'
                error={!!errors.last_name}
                helperText={errors.last_name?.message}
                fullWidth
                margin='dense'
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label='Email'
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                margin='dense'
              />
            )}
          />
          <Controller
            name='role'
            control={control}
            render={({field}) => (
              <Autocomplete
                {...field}
                fullWidth
                options={roles || []}
                getOptionLabel={(option: any) => option.name}
                onChange={(e, value: any) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Rol Seçiniz'
                    error={!!errors.role}
                    helperText={errors.role?.message}
                  />
                )}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant='outlined' color='secondary'>
            Vazgeç
          </Button>
          <Button type='submit' variant='contained'>
            {variant === 'create' ? 'Ekle' : 'Güncelle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UserDialog
