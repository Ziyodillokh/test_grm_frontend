import qs from "qs";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth-store";

import api from "./fetchInstance";

interface iError {
  status: number;
  response: {
    data: {
      message: string;
    };
  };
}

export const getAllData = async <T, Q>(url: string, query?: Q): Promise<T> => {
  try {
    const params = query
      ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
      : "";

    const res = await api.get(`${url}${params}`);
    return res.data;
  } catch (error) {
    handleError(error as iError);
    throw error;
  }
};

export const getByIdData = async <T, Q>(
  url: string,
  id: string,
  query?: Q
): Promise<T> => {
  try {
    const params = query
      ? `?${qs.stringify(query, { arrayFormat: "repeat" })}`
      : "";

    const res = await api.get(`${url}/${id}${params}`);
    return res.data;
  } catch (error) {
    handleError(error as iError);
    throw error;
  }
};

export const AddData = async <D extends object>(url: string, data: D) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error) {
    handleError(error as iError);
    throw error;
  }
};
export const PatchData = async <D extends object>(url: string, data: D) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error) {
    handleError(error as iError);
    throw error;
  }
};

export const UpdateData = async <D extends object>(
  url: string,
  id: string,
  data: D
) => {
  try {
    const res = await api.put(`${url}/${id}`, data);
    return res.data;
  } catch (error) {
    handleError(error as iError);
    throw error;
  }
};
export const UpdatePatchData = async <D extends object>(
  url: string,
  id: string,
  data: D
) => {
  try {
    const res = await api.patch(`${url}/${id}`, data);
    return res.data;
  } catch (error) {
    handleError(error as iError);
    throw error;
  }
};

export const DeleteData = async (url: string, id: string) => {
  try {
    const res = await api.delete(`${url}/${id}`);
    return res.data;
  } catch (error) {
    handleError(error as iError);
    throw error;
  }
};

export const UploadFile = async (url: string, data: FormData) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error) {
    handleError(error as iError);
    throw error;
  }
};

const handleError = (error: iError) => {
  const removeToken = useAuthStore.getState().removeToken;
  if (error.status == 401) {
    removeToken();
  }

  toast.error(error?.response?.data?.message);
};
