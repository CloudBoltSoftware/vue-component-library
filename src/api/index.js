import { createApi } from "@cloudbolt/js-sdk";

const api = createApi();
api.base.setAbortController();

export default api;
