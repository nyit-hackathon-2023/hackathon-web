import {TextField} from "@mui/material";
import {useState} from "react";

export default function ApiKeyPage() {
  const [key, setKey] = useState('')

  return (
    <TextField
      onChange={(event) => {
        setKey(event.target.value)
        localStorage.setItem('apiKey', event.target.value)
      }}
    >
      {key}
    </TextField>
  )
}
