// ** React Imports
import React, {
  createContext,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";

// ** MUI Imports
import { Button } from "@mui/material";

// ** Hook Imports
import { useForm, Control } from "react-hook-form";

// z.infer
type CarFormValues = {
  carMaker: string;
  carModel: string;
};

interface CarFormProps {
  onSubmitReady: (data: CarFormValues) => void;
  isLocked?: boolean;
  children?: React.ReactNode;
}

export interface CarFormAPI {
  resetField: (name: keyof CarFormValues) => unknown;
}

export const ControlContext = createContext<null | Control<any>>(null);

export const CarForm = forwardRef(
  (props: CarFormProps, ref: ForwardedRef<CarFormAPI>) => {
    const { handleSubmit, control, resetField } = useForm<{
      carMaker: string;
      carModel: string;
    }>();

    const resetFieldRef = useRef(resetField);
    useImperativeHandle(
      ref,
      () => {
        return {
          resetField: (name: keyof CarFormValues) => {
            resetFieldRef.current(name);
          }
        };
      },
      []
    );

    return (
      <ControlContext.Provider value={control}>
        <form onSubmit={handleSubmit(props.onSubmitReady)}>
          <fieldset
            disabled={props.isLocked}
            style={{
              border: "none",
              padding: 0
            }}
          >
            <div>{props.children}</div>
            <Button variant='contained' type="submit">Primary</Button>
          </fieldset>
        </form>
      </ControlContext.Provider>
    );
  }
);
