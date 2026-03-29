export type CropData = {
  biology_name: string;
  name: string;
  chats: [];
  createdAt: string;
  createdBy: string;
  crop_category: TCropCategory;
  crop_code: string;
  description: string;
  details: string;
  gallery: [];
  harvest_duration: number;
  id: string;
  is_common: boolean;
  main_image: {
    aws_path: string;
  };
  planting_time_end: string;
  planting_time_start: string;
  reels: [];
  updatedAt: string;
  updatedBy: string;
  variety: string;
};

export type CropQuery = {
  limit:number,
  page:number
};

export type TCropCategory = {
  id: number;
  name: string;
};

export type CropIdQuery = {
  populate: string;
};
