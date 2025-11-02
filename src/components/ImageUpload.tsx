import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string;
  bucketName: 'profile-photos' | 'video-intros';
  accept?: string;
  maxSizeMB?: number;
  label?: string;
}

export const ImageUpload = ({
  onUploadComplete,
  currentImageUrl,
  bucketName,
  accept = 'image/*',
  maxSizeMB = 5,
  label = 'Upload Image'
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        toast.error(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('You must be logged in to upload files');
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${bucketName}-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      setPreview(urlData.publicUrl);
      onUploadComplete(urlData.publicUrl);
      toast.success('Upload successful!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      uploadFile(file);
    }
  };

  const handleRemove = async () => {
    if (currentImageUrl) {
      try {
        // Extract filename from URL
        const urlParts = currentImageUrl.split('/');
        const fileName = urlParts.slice(-2).join('/'); // userId/filename

        await supabase.storage
          .from(bucketName)
          .remove([fileName]);

        setPreview(null);
        onUploadComplete('');
        toast.success('Image removed');
      } catch (error) {
        console.error('Remove error:', error);
        toast.error('Failed to remove image');
      }
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Upload preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-sage/20"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-sage/30 rounded-lg cursor-pointer hover:border-copper/50 transition-colors bg-ivory/50"
        >
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 text-copper animate-spin mb-4" />
              <p className="text-text-muted">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-sage mb-4" />
              <p className="text-text-dark font-medium mb-2">{label}</p>
              <p className="text-sm text-text-muted">
                Click to browse (max {maxSizeMB}MB)
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
