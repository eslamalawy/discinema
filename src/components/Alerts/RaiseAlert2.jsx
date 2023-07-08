import React,{useEffect, useRef} from "react";
import { Alert, Typography } from "@material-tailwind/react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { capitalizeFirstLetter } from "../../utils";
import $ from "jquery";

export default function RaiseAlert2({ state, message }) {
  const [open, setOpen] = React.useState(true);
  const alertRef = useRef(null);
  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove the alert after 3 seconds
      $(alertRef.current).fadeOut(300, () => {
        setOpen(false);
      });
    }, 2000);

    return () => {
      clearTimeout(timer); // Clear the timeout if the component unmounts
    };
  }, []);

  return (
    <React.Fragment>
      <Alert
        ref={alertRef}
        open={open}
        color={state == "success" ? "green" : "red"}
        className="max-w-screen-md"
        icon={
          state == "success" ? (
            <CheckCircleIcon className="mt-px h-6 w-6" />
          ) : (
            <XCircleIcon className="mt-px h-6 w-6" />
          )
        }
        onClose={() => setOpen(false)}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        <Typography variant="h5" color="white">
          {capitalizeFirstLetter(state)}
        </Typography>
        <Typography color="white" className="mt-2 font-normal">
          {message}
        </Typography>
      </Alert>
    </React.Fragment>
  );
}
