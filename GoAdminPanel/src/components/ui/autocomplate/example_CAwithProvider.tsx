// ** React Imports
import { useCallback, useEffect, useRef, useState } from 'react'

// ** Fake Api Imports
import { fetchCarMakers, fetchCarModelsByMakerId } from './api/fake-car-api'

// ** Component Imports
import { CarForm, CarFormAPI } from 'src/components/others/CarForm'
import { CAutocompleteWithProvider } from 'src/components/ui/autocomplate/CAutocompleteWithProvider'

export default function App() {
  const [carModels, setCarModels] = useState<
    | null
    | {
        id: string
        label: string
      }[]
  >(null)

  const formRef = useRef<CarFormAPI>(null)

  const handleCarMakerChanged = useCallback(async (id: string | null) => {
    console.log('onCarMakerChanged', id)

    // reset the field values???
    formRef.current?.resetField('carModel')
    setCarModels(null)
    if (id) {
      const carModels = await fetchCarModelsByMakerId(id)
      setCarModels(
        carModels.map((o: any) => {
          return {
            id: o.modelId,
            label: o.modelName
          }
        })
      )
    }
  }, [])

  const [carBrands, setCarBrand] = useState<
    | null
    | {
        id: string
        label: string
      }[]
  >(null)

  useEffect(() => {
    fetchCarMakers()
      .then((response: any) => {
        const mappedReponse = response.map((r: any) => {
          return {
            id: r.id,
            label: r.name
          }
        })
        setCarBrand(mappedReponse)
      })
      .catch((err: any) => {
        console.error(err)
      })
  }, [])

  return (
    <CarForm
      ref={formRef}
      onSubmitReady={data => {
        console.log('onSubmitReady', data)
      }}
      isLocked={carBrands === null}
    >
      <CAutocompleteWithProvider
        options={carBrands ?? []}
        name='carMaker'
        placeholder='Car Make'
        onChange={handleCarMakerChanged}
      />
      <br />

      <CAutocompleteWithProvider options={carModels ?? []} name='carModel' placeholder='Car Model' />
      <br />
    </CarForm>
  )
}
