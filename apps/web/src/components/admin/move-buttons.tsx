/** Up and down arrows that move an item one place in its list. */
export function MoveButtons({
  action,
  id,
  productId,
  locale,
  first,
  last,
}: {
  action: (fd: FormData) => Promise<void>;
  id: string;
  productId: string;
  locale: string;
  first: boolean;
  last: boolean;
}) {
  return (
    <div className="flex gap-1">
      {(["up", "down"] as const).map((dir) => (
        <form key={dir} action={action}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="dir" value={dir} />
          <button
            type="submit"
            disabled={dir === "up" ? first : last}
            aria-label={dir === "up" ? "Move up" : "Move down"}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white/5 text-sm text-mute transition hover:text-ink disabled:opacity-30"
          >
            {dir === "up" ? "↑" : "↓"}
          </button>
        </form>
      ))}
    </div>
  );
}
