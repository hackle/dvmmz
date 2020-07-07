import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';
export function Loader() {
  const [open, setOpen] = React.useState(true);

  return (
    <Backdrop open={open} onClick={() => setOpen(false)}>
      <CircularProgress />
    </Backdrop>
  );
}
