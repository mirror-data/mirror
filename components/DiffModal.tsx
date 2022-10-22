import * as React from "react";
import {Box, Button, Modal} from "@mui/material";
import {DiffEditor} from "@monaco-editor/react";

interface DiffModal {
    index: number
    instruction: string
    original: string
    modified: string
}

const style = {
    position: 'absolute' as 'absolute',
    top: '40px',
    bottom: '40px',
    left: '60px',
    right: '60px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
export const DiffModal: React.FC<DiffModal> = ({instruction, original, modified, index}) => {
    const [open, setOpen] = React.useState(false);
    return <>
        <Button onClick={() => setOpen(true)} variant={"outlined"}>#{index} {instruction}</Button>
        <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={{...style}}>
                <DiffEditor
                    original={original}
                    modified={modified}
                />
            </Box>
        </Modal>
    </>

}