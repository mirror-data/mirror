import { Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import * as React from 'react'
import { useEffect } from 'react'

interface InstructionProps {
  editLoading: boolean
  onEdit: (edit: string) => void
}
const Instruction: React.FC<InstructionProps> = ({ editLoading, onEdit }) => {
  const [instruction, setInstruction] = React.useState<string>('')

  useEffect(() => {
    if (!editLoading) {
      setInstruction('')
    }
  }, [editLoading])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInstruction(event.target.value)
  }

  return (
    <div className="flex gap-4 mt-4">
      <TextField
        label="Add more instructions"
        size="small"
        value={instruction}
        disabled={editLoading}
        onChange={handleChange}
        fullWidth
        sx={{
          '& label': {
            color: '#a1a1a1!important',
          },
          '& input': {
            color: '#fff',
            webkitTextFillColor: '#fff!important',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'rgb(25, 118, 210)',
          },
          '& .MuiOutlinedInput-root': {
            background: 'rgb(23,23,23)',
            '& fieldset': {
              borderColor: 'rgb(34, 139, 230)',
            },
            '&:hover fieldset': {
              borderColor: 'rgb(25, 118, 210)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgb(25, 118, 210)',
            },
            '&.Mui-disabled': {
              color: '#a1a1a1',
              '& fieldset': {
                borderColor: 'rgb(87, 87, 87)',
              },
            },
          },
        }}
      />
      {editLoading ? (
        <LoadingButton
          className="bg-gray-600"
          size="small"
          variant="outlined"
          loading
        />
      ) : (
        <Button
          className="submit-instruction-button"
          size="small"
          variant="contained"
          onClick={(e) => {
            onEdit(instruction)
          }}
        >
          Submit
        </Button>
      )}
    </div>
  )
}

export default Instruction
