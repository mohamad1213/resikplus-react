import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThumbnailUploadProps {
    value: string;
    onChange: (url: string, file?: File) => void;
}

const ThumbnailUpload = ({ value, onChange }: ThumbnailUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File) => {
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    onChange(e.target?.result as string, file);
                };
                reader.readAsDataURL(file);
            }
        },
        [onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    return (
        <div className="space-y-2">
            {value ? (
                <div className="relative group rounded-xl overflow-hidden border border-border">
                    <img
                        src={value}
                        alt="Thumbnail"
                        className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                        >
                            <Upload className="h-4 w-4" />
                            Ganti
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => onChange("")}
                            className="gap-2"
                        >
                            <X className="h-4 w-4" />
                            Hapus
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    className={cn(
                        "border-2 border-dashed rounded-xl h-56 flex flex-col items-center justify-center cursor-pointer transition-all",
                        isDragging
                            ? "border-primary bg-primary/5 scale-[1.02]"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                            <ImagePlus className="h-7 w-7 text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-foreground">Upload Thumbnail</p>
                            <p className="text-sm mt-1">
                                Drag & drop atau{" "}
                                <span className="text-primary font-medium">pilih file</span>
                            </p>
                            <p className="text-xs mt-1">PNG, JPG, WEBP (Maks. 5MB)</p>
                        </div>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                }}
            />
        </div>
    );
};

export default ThumbnailUpload;
