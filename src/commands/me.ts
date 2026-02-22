import { apiGet } from "../api.js";
import { success } from "../output.js";

export async function getMe() {
  const data = await apiGet("/");
  success(data);
}
