import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { AddData, getAllData, UploadFile } from "@/service/apiHelpers";
import { apiRoutes } from "@/service/apiRoutes";
import { TResponse } from "@/types";

// ---------- types ----------
export interface VideoMessageUser {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  position: {
    id: string;
    title: string;
    role: number;
  };
}

export interface VideoMessage {
  id: string;
  videoPath: string;
  title?: string;
  targetRole?: number;
  targetUserId?: string;
  createdAt?: string;
  dateOne?: string;
  updatedAt?: string;
  isActive?: boolean;
  sender?: VideoMessageUser;
  targetUser?: VideoMessageUser;
}

// ---------- queries ----------

/** Fetch all video messages for the current user */
export const useVideoMessages = () => {
  return useQuery({
    queryKey: [apiRoutes.videoMessages],
    queryFn: () =>
      getAllData<VideoMessage[], void>(apiRoutes.videoMessages),
  });
};

/** Upload a video file to MinIO */
export const useUploadVideo = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", "video");
      return UploadFile(
        "/media-upload/single/video-messages/video-messages",
        formData
      ) as Promise<{ id: string; path: string }>;
    },
  });
};

/** Create a new video message record */
export const useCreateVideoMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      videoPath: string;
      title?: string;
      targetRole?: number;
      targetUserId?: string;
    }) => AddData(apiRoutes.videoMessages, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.videoMessages] });
      toast.success("Video murojaat yuborildi");
    },
  });
};

/** Upload video and create message in one step */
export const useUploadAndCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      file: File;
      targetRole?: number;
      targetUserId?: string;
      title?: string;
    }) => {
      const formData = new FormData();
      formData.append("video", data.file);
      if (data.targetRole) formData.append("targetRole", String(data.targetRole));
      if (data.targetUserId && data.targetUserId !== "all") formData.append("targetUserId", data.targetUserId);
      if (data.title) formData.append("title", data.title);
      return UploadFile(apiRoutes.videoMessages + "/upload", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiRoutes.videoMessages] });
      toast.success("Video murojaat yuborildi!");
    },
    onError: () => {
      toast.error("Xatolik yuz berdi");
    },
  });
};

/** Fetch users filtered by role (for the recipient dropdown) */
export const useUsersByRole = (role?: number) => {
  return useQuery({
    queryKey: [apiRoutes.user, { role }],
    queryFn: () =>
      getAllData<
        TResponse<VideoMessageUser>,
        { limit: number; page: number; role: number }
      >(apiRoutes.user, { limit: 100, page: 1, role: role! }),
    enabled: !!role,
  });
};
