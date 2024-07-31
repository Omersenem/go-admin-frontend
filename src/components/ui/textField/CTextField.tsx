// ** Hooks
import { Controller, Control, Path, FieldValues } from 'react-hook-form'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import { FormControl, FormHelperText } from '@mui/material'

// ** Interfaces
interface RHFAutocompleteFieldProps<TField extends FieldValues> {
  control: Control<TField>
  name: Path<TField>
  label: string
  placeholder?: string
}

export const CTextField = <TField extends FieldValues>(props: RHFAutocompleteFieldProps<TField>) => {
  // ** Props
  const { control, name, label } = props

  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const { onChange, value, ref } = field

          return (
            <>
              <TextField
                value={value}
                label={label}
                onChange={onChange}
                placeholder={props.placeholder}
                inputRef={ref}
                error={!!error?.message}
              ></TextField>
              {error?.message && <FormHelperText sx={{ color: 'error.main' }}>{error.message}</FormHelperText>}
            </>
          )
        }}
      />
    </FormControl>
  )
}
