// LIBRARYS
import axios from "@api/axios";

// API
import { API_URL } from "@api/credentials";

// Comprobar si un usuario administrador existe
export default async function verifyIfExistAdmin() {
  try {
    const URL = `${API_URL}/api/admin/existAdmin`
    const res = await axios.get(URL);

    const { existUserAdmin } = res.data

    return existUserAdmin;
  } catch (error) {
    return null
  }
};
