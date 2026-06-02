declare module "*.wasm" {
  const wasm: WebAssembly.Module;
  export default wasm;
}

// <model-viewer> is a custom element registered at runtime by
// @google/model-viewer. React 19 uses React.JSX for intrinsics, so we
// extend that namespace.
import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          ar?: boolean;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
          "interaction-prompt"?: "auto" | "when-focused" | "none";
          "shadow-intensity"?: string | number;
          exposure?: string | number;
          "environment-image"?: string;
          loading?: "eager" | "lazy";
          reveal?: "auto" | "interaction" | "manual";
          poster?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
