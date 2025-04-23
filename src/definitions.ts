/**
 * Whether to remove all entries or just one.
 * If removing just one, the id is required.
 */
export type RemoveOptions =
  | { removeAll: true }
  | { removeAll: false; id: string }
