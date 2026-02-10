import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Redo,
    Undo,
    Link as LinkIcon,
    ImagePlus,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Highlighter,
    Palette,
    Minus,
    CodeSquare,
    Unlink,
} from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const ToolbarButton = ({
    onClick,
    isActive = false,
    disabled = false,
    tooltip,
    children,
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    tooltip: string;
    children: React.ReactNode;
}) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                    "h-8 w-8 rounded-md transition-colors",
                    isActive && "bg-primary/10 text-primary"
                )}
                onClick={onClick}
                disabled={disabled}
            >
                {children}
            </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
            {tooltip}
        </TooltipContent>
    </Tooltip>
);

const COLORS = [
    "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
    "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
    "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
];

const RichTextEditor = ({ content, onChange, placeholder = "Tulis konten berita yang menarik..." }: RichTextEditorProps) => {
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Image.configure({ inline: false, allowBase64: true }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-primary underline cursor-pointer" },
            }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Underline,
            Placeholder.configure({ placeholder }),
            TextStyle,
            Color,
            Highlight.configure({ multicolor: true }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class:
                    "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[400px] px-6 py-4",
            },
        },
    });

    const addImage = useCallback(() => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl("");
        }
    }, [editor, imageUrl]);

    const handleImageUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file && editor) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const result = event.target?.result as string;
                    editor.chain().focus().setImage({ src: result }).run();
                };
                reader.readAsDataURL(file);
            }
        },
        [editor]
    );

    const setLink = useCallback(() => {
        if (linkUrl && editor) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: linkUrl })
                .run();
            setLinkUrl("");
        }
    }, [editor, linkUrl]);

    if (!editor) return null;

    return (
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
            {/* Toolbar */}
            <div className="border-b border-border bg-muted/30 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    tooltip="Undo"
                >
                    <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    tooltip="Redo"
                >
                    <Redo className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    tooltip="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    tooltip="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    tooltip="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Text formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    tooltip="Bold"
                >
                    <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    tooltip="Italic"
                >
                    <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive("underline")}
                    tooltip="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    tooltip="Strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    tooltip="Inline Code"
                >
                    <Code className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Text Color */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md"
                        >
                            <Palette className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                        <div className="grid grid-cols-10 gap-1">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className="h-5 w-5 rounded-sm border border-border hover:scale-125 transition-transform"
                                    style={{ backgroundColor: color }}
                                    onClick={() => editor.chain().focus().setColor(color).run()}
                                />
                            ))}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 w-full text-xs"
                            onClick={() => editor.chain().focus().unsetColor().run()}
                        >
                            Reset Warna
                        </Button>
                    </PopoverContent>
                </Popover>

                {/* Highlight */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
                    isActive={editor.isActive("highlight")}
                    tooltip="Highlight"
                >
                    <Highlighter className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("left").run()}
                    isActive={editor.isActive({ textAlign: "left" })}
                    tooltip="Rata Kiri"
                >
                    <AlignLeft className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("center").run()}
                    isActive={editor.isActive({ textAlign: "center" })}
                    tooltip="Rata Tengah"
                >
                    <AlignCenter className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("right").run()}
                    isActive={editor.isActive({ textAlign: "right" })}
                    tooltip="Rata Kanan"
                >
                    <AlignRight className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                    isActive={editor.isActive({ textAlign: "justify" })}
                    tooltip="Rata Kanan Kiri"
                >
                    <AlignJustify className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    tooltip="Bullet List"
                >
                    <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    tooltip="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Blockquote & Code Block */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive("blockquote")}
                    tooltip="Kutipan"
                >
                    <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    isActive={editor.isActive("codeBlock")}
                    tooltip="Code Block"
                >
                    <CodeSquare className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    tooltip="Garis Horizontal"
                >
                    <Minus className="h-4 w-4" />
                </ToolbarButton>

                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Link */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-md",
                                editor.isActive("link") && "bg-primary/10 text-primary"
                            )}
                        >
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">URL Link</Label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://contoh.com"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && setLink()}
                                />
                                <Button size="sm" onClick={setLink}>
                                    Tambah
                                </Button>
                            </div>
                            {editor.isActive("link") && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full gap-2"
                                    onClick={() => editor.chain().focus().unsetLink().run()}
                                >
                                    <Unlink className="h-3 w-3" /> Hapus Link
                                </Button>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Image */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md"
                        >
                            <ImagePlus className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Upload Gambar</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="cursor-pointer"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-popover px-2 text-muted-foreground">atau</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">URL Gambar</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://contoh.com/gambar.jpg"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addImage()}
                                    />
                                    <Button size="sm" onClick={addImage}>
                                        Tambah
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            {/* Bubble menu removed - not exported from this version */}

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Word count */}
            <div className="border-t border-border bg-muted/20 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                    {editor.storage.characterCount?.characters?.() ?? editor.getText().length} karakter
                </span>
                <span>
                    {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} kata
                </span>
            </div>
        </div>
    );
};

export default RichTextEditor;
