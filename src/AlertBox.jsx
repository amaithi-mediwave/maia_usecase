// AlertBox.js
import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const AlertBox = ({ message, severity, timeout, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
      if (onClose) {
        onClose();
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onClose]);

  return (
    <Snackbar open={open} autoHideDuration={timeout} onClose={() => setOpen(false)}>
      <Alert onClose={() => setOpen(false)} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertBox;
