import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteProps, TextField } from "@mui/material";

interface ComboBoxProps extends Omit<AutocompleteProps<string, false, false, false>, 'renderInput'> {
  label: string;
  options: string[];
}


export default function ComboBox({ options, label, ...rest } : ComboBoxProps ) {
    return (
        <Autocomplete
            options={options}
            sx= {{ width : 300 }}
            renderInput={(params) => <TextField {...params} label={label}/>}
            {...rest}
        />
    )
};
