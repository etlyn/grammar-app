import { Fragment } from "react";
// Authoring supports emphasis only; content is always rendered as text, never HTML.
export function RichText({ children }: { children: string }) {
  return (
    <>
      {children
        .split(/(\*\*[^*]+\*\*)/g)
        .map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={i}>{part.slice(2, -2)}</strong>
          ) : (
            <Fragment key={i}>{part}</Fragment>
          ),
        )}
    </>
  );
}
