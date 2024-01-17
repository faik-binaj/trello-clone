import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File | null | undefined) => {
  if (!file) return;

  return await storage.createFile("6575fc1be595042bfd7d", ID.unique(), file);
};

export default uploadImage;
