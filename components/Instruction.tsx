import {Button, TextField} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import * as React from "react";
import {useEffect} from "react";

interface InstructionProps {
  editLoading: boolean
  onEdit: (edit: string) => void
}
const Instruction: React.FC<InstructionProps> = ({editLoading, onEdit}) => {
  const [instruction, setInstruction] = React.useState<string>("")
  useEffect(() => {
    if (!editLoading) {
      setInstruction("")
    }

  }, [editLoading])
  return <div className={"flex"}>
    <TextField
      className={"flex-grow"}
      label="Add more instructions"
      variant="standard"
      value={instruction}
      disabled={editLoading}
      onChange={e => setInstruction(e.target.value)}
      fullWidth
    />
    {
      editLoading
        ? <LoadingButton size="small" variant="outlined" loading/>
        :
        <Button className="submit-instruction-button" size="small" variant="contained" onClick={e => {
          onEdit(instruction)

        }}>Submit</Button>

    }
  </div>

}

export default Instruction