import { storage } from "@/appwrite";
import { Image } from "@/typing";

export const getUrl = async (image: Image) => {
  return storage.getFilePreview(image.bucketId, image.fileId);
};
