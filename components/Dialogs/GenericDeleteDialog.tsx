import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

export type IGenericDeleteDialogProps = {
    openDialog: boolean
    title: string
    message: string
    handleClose: () => void
    handleDelete: () => void
};

export default function GenericDeleteDialog({ openDialog, title, message, handleClose, handleDelete }: IGenericDeleteDialogProps) {
    return (
        <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">Cancelar</Button>
                <Button onClick={handleDelete} autoFocus variant="outlined" color="error">
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    )
}