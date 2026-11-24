"use client";

/** A submit button that asks "are you sure?" first. For deletes. */
export function ConfirmButton({
  message,
  className = "btn btn-glass !px-4 !py-2 !text-rose",
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
