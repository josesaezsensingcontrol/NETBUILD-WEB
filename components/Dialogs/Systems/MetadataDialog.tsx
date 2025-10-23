import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Stack } from "@mui/material";

export type MetadataDialogProps = {
    openDialog: boolean;
    handleClose: () => void;
    metadata: { [key: string]: string };
};

export default function MetadataDialog({ openDialog, handleClose, metadata }: MetadataDialogProps) {
    return (
        <Dialog
            open={openDialog}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle>Metadatos</DialogTitle>
            <DialogContent sx={{ height: 300 }}>
                {Object.keys(metadata).length === 0 &&
                    <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
                        <Typography>Sistema sin metadatos</Typography>
                    </Stack>
                }
                {Object.keys(metadata).map(metaKey =>
                    <Stack key={metaKey} direction="row" alignItems="center" justifyContent="space-between">
                        <Typography>{metaKey}</Typography>
                        <Typography>{metadata[metaKey]}</Typography>
                    </Stack>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose()} variant="outlined">Cerrar</Button>
            </DialogActions>
        </Dialog>
    )
}