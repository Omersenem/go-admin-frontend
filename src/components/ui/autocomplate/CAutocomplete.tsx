// Hooks
import { Controller, FieldValues } from 'react-hook-form'

// ** MUI Imports
import { FormControl, FormHelperText, TextField, Autocomplete } from '@mui/material'

// ** Type Imports
import type { CAutocompleteProps } from 'src/types/ui/CAutoComplete'

/**
 * @component CAutocomplete
 * @summary Custom Autocomplete component to be used with react-hook-form
 * @param {CAutocompleteProps} props
 * @returns {JSX.Element}
 * @example
 * <CAutocomplete
 *  control={control}
 *  name='name'
 *  options={options}
 *  label='Name'
 *  placeholder='Select a name'
 * />
 */
export const CAutocomplete = <O extends { id: string; label: string }, TField extends FieldValues>(
  props: CAutocompleteProps<O, TField>
): JSX.Element => {
  // ** Props
  const { control, options, name, label, placeholder = '' } = props

  return (
    <FormControl fullWidth>
      <Controller
        name={name}
        control={control}
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
                  onChange(newValue ? newValue.id : null)
                }}
                id='controllable-states-demo'
                options={options}
                renderInput={params => (
                  <TextField
                    {...params}
                    inputRef={ref}
                    error={!!error?.message}
                    label={label}
                    placeholder={placeholder}
                  />
                )}
              />
              {error?.message && <FormHelperText sx={{ color: 'error.main' }}>{error.message}</FormHelperText>}
            </>
          )
        }}
      />
    </FormControl>
  )
}
