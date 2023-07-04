import React from "react";
import Drawer from "./Drawer";

export default function Example() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <main className="d-block">
      <button
        className="bg-green-600 text-white rounded px-4 py-1"
        onClick={() => setIsOpen(true)}
      >
        open
      </button>
      <section className=" space-x-6 m-4">
        <div className="text-6xl">{"🦙"}</div>
        <div className="text-6xl">{"🐝"}</div>
        <div className="text-6xl">{"🦄"}</div>
        <div className="text-6xl">{"🐌"}</div>

        <div className="text-6xl">{"🦙"}</div>
        <div className="text-6xl">{"🐝"}</div>
        <div className="text-6xl">{"🦄"}</div>
        <div className="text-6xl">{"🐌"}</div>
        <div className="text-6xl">{"🦙"}</div>
        <div className="text-6xl">{"🐝"}</div>
        <div className="text-6xl">{"🦄"}</div>
        <div className="text-6xl">{"🐌"}</div>
        <div className="text-6xl">{"🦙"}</div>
        <div className="text-6xl">{"🐝"}</div>
        <div className="text-6xl">{"🦄"}</div>
        <div className="text-6xl">{"🐌"}</div>
                <div className="text-6xl">{"🦙"}</div>
        <div className="text-6xl">{"🐝"}</div>
        <div className="text-6xl">{"🦄"}</div>
        <div className="text-6xl">{"🐌"}</div>
        <div className="text-6xl">{"🦙"}</div>
        <div className="text-6xl">{"🐝"}</div>
        <div className="text-6xl">{"🦄"}</div>
        <div className="text-6xl">{"🐌"}</div>
        <div className="text-6xl">{"🦙"}</div>
        <div className="text-6xl">{"🐝"}</div>
        <div className="text-6xl">{"🦄"}</div>
        <div className="text-6xl">{"🐌"}</div>
      </section>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
        <div>inside this drawer</div>
      </Drawer>
    </main>
  );
}
