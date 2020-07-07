import { Snackbar } from "@material-ui/core"
import React, { useState } from "react";

export default function AppError({ error }: { error: string | undefined}) {
    const [open, setOpen] = useState(true);

    return (
        <Snackbar
            anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
            }}
            open={!!error && open}
            autoHideDuration={6000}
            onClose={() => setOpen(false) }
            message={error}
        />
    );
}