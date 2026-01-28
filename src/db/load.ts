export function loadData<T>() : T | null {
  const raw = localStorage.getItem("redungeon-db");
  if (!raw) return null;

  return JSON.parse(raw) as T;
}
