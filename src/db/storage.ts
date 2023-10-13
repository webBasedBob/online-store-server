import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Define interfaces for response objects
interface SupabaseResponse {
  data: any;
  error?: any;
}

interface UploadPictureArgs {
  file: Blob;
  productId: string;
}

interface GetPhotoURLArgs {
  path: string;
}

const STORAGE_URL: string | undefined = process.env.STORAGE_URL;
const STORAGE_API_KEY: string | undefined = process.env.STORAGE_API_KEY;

// Create Supabase client
const supabase: SupabaseClient | undefined =
  STORAGE_URL && STORAGE_API_KEY
    ? createClient(STORAGE_URL, STORAGE_API_KEY)
    : undefined;

export async function uploadPicture({
  file,
  productId,
}: UploadPictureArgs): Promise<any> {
  if (!supabase) {
    // Handle missing Supabase client
    throw new Error("Supabase client is not available.");
  }

  const { data, error }: SupabaseResponse = await supabase.storage
    .from("products")
    .upload(`${productId}/${file.name}`, file, {
      contentType: file.type,
    });

  if (error) {
    // Handle error
    console.error("Error in uploadPicture:", error);
    throw error;
  } else {
    // Handle success
    return data;
  }
}

export function getPhotoURL({ path }: GetPhotoURLArgs): string {
  if (!supabase) {
    // Handle missing Supabase client
    throw new Error("Supabase client is not available.");
  }

  const {
    data: { publicUrl },
  }: SupabaseResponse = supabase.storage.from("products").getPublicUrl(path);
  return publicUrl;
}
