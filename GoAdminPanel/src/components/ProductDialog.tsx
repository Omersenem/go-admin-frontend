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
import {useEffect,Fragment,useState} from "react";
import {Link,Typography,ListItem,IconButton,List} from '@mui/material';
import {useDropzone} from 'react-dropzone'
import {styled} from '@mui/material/styles'
import Icon from "src/@core/components/icon";
import {log} from "next/dist/server/typescript/utils";


// Validation Schema
const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  image: yup.mixed().required('Image is required'),
  price: yup.number().required('Price is required'),
})

interface ProductDialogProps {
  open: boolean
  handleClose: () => void
  variant: string
  data?: {
    id:number
    title: string
    description: string
    image: string
    price: number
  }
}
interface FileProp {
  name: string
  type: string
  size: number
}

// Styled component for the upload image inside the dropzone area



const ProductDialog = (prop: ProductDialogProps) => {
  const {open, handleClose, variant, data}=prop
  const [files, setFiles] = useState<File[]>([])


  const {getRootProps, getInputProps} = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles)
    }
  })
  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)}/>
    } else {
      return <Icon icon='mdi:file-document-outline'/>
    }
  }
  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    setFiles([...filtered])
  }
  const fileList = files.map((file: FileProp) => (
    <ListItem key={file.name}>
      <div className='file-details'>
        <div className='file-preview'>{renderFilePreview(file)}</div>
        <div>
          <Typography className='file-name'>{file.name}</Typography>
          <Typography className='file-size' variant='body2'>
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Icon icon='mdi:close' fontSize={20}/>
      </IconButton>
    </ListItem>
  ))
  const handleRemoveAllFiles = () => {
    setFiles([])
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: data || {
      id:0,
      title: '',
      description: '',
      image: '',
      price: 0
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (formData: any) => {
    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('description', formData.description);
    formDataObj.append("image", `http://localhost:8080/api/uploads/${files[0].path}`)  ;
    formDataObj.append('price', formData.price);

    const createProducts = async () => {
      if(files){
        const formData = new FormData();
        files.forEach((item) => formData.append("image", item))
        const url = 'http://localhost:8080/api/upload';
        const response = await fetch(url, {
          method: 'POST',
          body:formData,
          credentials: 'include',
        });
        console.log('res',response)
      }

      try {
        const url = 'http://localhost:8080/api/products';
        const response = await fetch(url, {
          method: 'POST',
          body: formDataObj,
          credentials: 'include',
        });
        const data = await response.json();
        console.log('Response:', data);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    const updateProducts = async () => {
      try {
        const productsId = data?.id;
        const url = `http://localhost:8080/api/products/${productsId}`;
        const response = await fetch(url, {
          method: 'PUT',
          body: formDataObj,
          credentials: 'include',
        });
        const responseData = await response.json();
        console.log('Response:', responseData);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    if (variant === 'create') {
      createProducts();
    } else {
      updateProducts();
    }

    handleClose();
  };


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
        Ürün {variant === 'create' ? 'Ekle' : 'Güncelle'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name='title'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label='Başlık'
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
                margin='dense'
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label='Açıklama'
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
                margin='dense'
              />
            )}
          />
          <Fragment>
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <Typography color='textSecondary'
                          sx={{'& a': {color: 'white', textDecoration: 'none'}}}>
                <TextField id='outlined-basic' label='Dosya eklemek için tıklayınız' fullWidth>
                  <Link href='/' onClick={e => e.preventDefault()}/>
                </TextField>
              </Typography>
            </div>

            {files.length ? (
              <Fragment>
                <List>{fileList}</List>
                <div className='buttons'>
                  <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
                    Eklenen Dosyayı Sil
                  </Button>
                </div>
              </Fragment>
            ) : null}
          </Fragment>
          <Controller
            name='price'
            control={control}
            render={({field}) => (
              <TextField
                {...field}
                label='Fiyat'
                error={!!errors.price}
                helperText={errors.price?.message}
                fullWidth
                margin='dense'
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

export default ProductDialog
