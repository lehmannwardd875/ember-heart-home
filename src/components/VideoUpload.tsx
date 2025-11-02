import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';

interface VideoUploadProps {
  onUploadComplete: (url: string) => void;
  currentVideoUrl?: string;
  maxSizeMB?: number;
}

export const VideoUpload = ({
  onUploadComplete,
  currentVideoUrl,
  maxSizeMB = 50
}: VideoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(currentVideoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadVideo = async (file: File) => {
    try {
      setUploading(true);

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        toast.error(`Video size must be less than ${maxSizeMB}MB`);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a video file');
        return;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error('You must be logged in to upload videos');
        return;
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/video-intro-${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('video-intros')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('video-intros')
        .getPublicUrl(fileName);

      setVideoUrl(urlData.publicUrl);
      onUploadComplete(urlData.publicUrl);
      toast.success('Video uploaded successfully!');
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
      uploadVideo(file);
    }
  };

  const handleRemove = async () => {
    if (currentVideoUrl) {
      try {
        // Extract filename from URL
        const urlParts = currentVideoUrl.split('/');
        const fileName = urlParts.slice(-2).join('/'); // userId/filename

        await supabase.storage
          .from('video-intros')
          .remove([fileName]);

        setVideoUrl(null);
        onUploadComplete('');
        toast.success('Video removed');
      } catch (error) {
        console.error('Remove error:', error);
        toast.error('Failed to remove video');
      }
    } else {
      setVideoUrl(null);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {videoUrl ? (
        <div className="relative">
          <video
            src={videoUrl}
            controls
            className="w-full h-64 rounded-lg border-2 border-sage/20 bg-text-dark"
          >
            Your browser does not support the video tag.
          </video>
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
              <p className="text-text-muted">Uploading video...</p>
              <p className="text-sm text-text-muted mt-2">This may take a moment</p>
            </>
          ) : (
            <>
              <Play className="h-12 w-12 text-sage mb-4" />
              <p className="text-text-dark font-medium mb-2">Upload Video Intro</p>
              <p className="text-sm text-text-muted mb-2">
                15 seconds, max {maxSizeMB}MB
              </p>
              <p className="text-xs text-text-muted italic">
                Share what you're looking for — speak from the heart
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
