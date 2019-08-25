import React from 'react';
import { TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';


const FormField: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField
      {...props}
      variant="outlined"
      margin="normal"
    />
  );
}

export default FormField;
