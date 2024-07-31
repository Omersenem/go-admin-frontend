// ** React Imports
import { useContext } from 'react'

// ** Hooks
import { Controller, Control, Path, FieldValues } from 'react-hook-form'

// ** MUI Imports
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

// ** Component Imports
import { ControlContext } from '../../others/CarForm'

// ** Interfaces
interface CAutocompleteWithProviderProps<O extends { id: string; label: string }, TField extends FieldValues> {
  control?: Control<TField>
  name: Path<TField>
  options: O[]
  label: string
  placeholder?: string
  onChange?: (id: string | null) => void
}

export const CAutocompleteWithProvider = <O extends { id: string; label: string }, TField extends FieldValues>(
  props: CAutocompleteWithProviderProps<O, TField>
) => {
  // ** Props
  const { options, name, label } = props

  // ** Hooks
  const contextControl = useContext(ControlContext)
  const control = contextControl ?? props.control

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: 'Bu Alan Gereklidir'
      }}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field

        return (
          <>
            <Autocomplete
              value={
                value
                  ? options.find(option => {
                      return value === option.id
                    }) ?? null
                  : null
              }
              getOptionLabel={option => {
                return option.label
              }}
              onChange={(_: any, newValue) => {
                const resolvedId = newValue ? newValue.id : null
                onChange(resolvedId)
                props.onChange?.(resolvedId)
              }}
              id='controllable-states-demo'
              options={options}
              renderInput={params => (
                <TextField {...params} label={label} placeholder={props.placeholder} inputRef={ref} />
              )}
            />
            {error ? <span style={{ color: 'red' }}>{error.message}</span> : null}
          </>
        )
      }}
    />
  )
}
