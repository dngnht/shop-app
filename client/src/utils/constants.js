const apiUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000/api"
    : "someDeployUrl";
const LOCAL_STORAGE_TOKEN = "token";
const LOCAL_STORAGE_ROLE = "role";

export { apiUrl, LOCAL_STORAGE_ROLE, LOCAL_STORAGE_TOKEN };
