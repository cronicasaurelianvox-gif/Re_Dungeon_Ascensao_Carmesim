export function saveData(data: unknown) {
  localStorage.setItem("redungeon-db", JSON.stringify(data));
  console.log("💾 Dados salvos");
}
