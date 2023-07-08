import { useState, useEffect, useRef, Fragment } from "react";
import { Alert } from "@material-tailwind/react";
import $ from "jquery";

export default function RaiseAlert({ state, message }) {
  const [open, setOpen] = useState(true);
  const alertRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove the alert after 3 seconds
      $(alertRef.current).fadeOut(300, () => {
        setOpen(false);
      });
    }, 3000);

    return () => {
      clearTimeout(timer); // Clear the timeout if the component unmounts
    };
  }, []);

  return (
    <Fragment>
      <Alert
        ref={alertRef}
        open={open}
        color={state === "success" ? "green" : "red"}
        onClose={() => setOpen(false)}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        {message}
      </Alert>
    </Fragment>
  );
}
