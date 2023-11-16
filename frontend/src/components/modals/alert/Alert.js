import React from 'react';

// material ui
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const Alert = ({
    open,
    setOpen,
    title,
    btnOkText = 'Confirm',
    btnCancelText = 'Cancel',
    handleOk,
    description = null,
}) => {
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle style={{ paddingBottom: description && '0' }} id="alert-dialog-title">
                {title}
            </DialogTitle>

            {description && (
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
                </DialogContent>
            )}

            <DialogActions style={{ placeContent: 'center', marginBottom: '.5rem' }}>
                <Button size="small" variant="contained" onClick={() => setOpen(false)} color="primary">
                    {btnCancelText}
                </Button>
                <Button size="small" variant="outlined" onClick={handleOk} color="primary" autoFocus>
                    {btnOkText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Alert;
