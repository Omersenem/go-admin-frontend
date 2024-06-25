// ** Types
import { Image } from './global'

export type Institution = {
  id: number
  name: string
  is_active: boolean
  image: Image
}

export type InitialState = {
  institution: Institution | null
}
