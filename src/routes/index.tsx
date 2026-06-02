import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Landing } from "../components/Landing";

const DEFAULT_HANDLE = "imlunahey.com";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState(DEFAULT_HANDLE);

  function submit(e: FormEvent) {
    e.preventDefault();
    const cleaned = handle.replace(/^@/, "").trim();
    if (!cleaned) return;
    navigate({ to: "/@{$handle}", params: { handle: cleaned } });
  }

  return (
    <Landing
      handle={handle}
      setHandle={setHandle}
      onSubmit={submit}
      onPickExample={(h) =>
        navigate({ to: "/@{$handle}", params: { handle: h } })
      }
      state={{ kind: "idle" }}
    />
  );
}
