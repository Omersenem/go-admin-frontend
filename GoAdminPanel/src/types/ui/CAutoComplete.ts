import { Control, Path, FieldValues } from 'react-hook-form'

export interface CAutocompleteProps<O extends { id: string; label: string }, TField extends FieldValues> {
  /**
   * Control: react-hook-form control
   **/
  control: Control<TField>

  /**
   * Name: name of the field
   **/
  name: Path<TField>

  /**
   * Options: dynamic array of options to display
   **/
  options: O[]

  /**
   * Label: label of the field
   **/
  label: string

  /**
   * Placeholder: placeholder of the field
   **/
  placeholder?: string
}
