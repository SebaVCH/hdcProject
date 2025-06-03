import { Autocomplete, AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteProps, TextField } from "@mui/material";

interface ComboBoxProps extends Omit<AutocompleteProps<string, false | true, false | true, false | true>, 'renderInput'> {
  label: string;
  options: string[];
}


export default function ComboBox({ options, label, fullWidth, ...rest } : ComboBoxProps ) {

    return (
        <Autocomplete
            options={options}
            sx= {{ width : fullWidth ? '100%' : 300 }}
            renderInput={(params) => <TextField {...params} label={label}/>}
            {...rest}
        />
    )
};
