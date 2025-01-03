import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useAuth } from "../../lib/auth";
import { createCompanion, getAvailableFilters } from "../../services/companion/companion";
import { Bot, Loader2, Info, Upload, Sparkles, Tags, Link2, AlertCircle, Smartphone, Monitor, Check, Image, Trash2 } from "lucide-react";

interface CompanionFormData {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_public: boolean;
  tags: string[];
  creator_name: string;
  chat_url: string;
  screenshots: string[];
}

const SubmitCompanion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("basics");
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
    const [formProgress, setFormProgress] = useState(0);
    const { user } = useAuth();
    const [formData, setFormData] = useState<CompanionFormData>({
        id: crypto.randomUUID(),
        name: "",
        description: "",
        avatar_url: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: user?.id || "",
        is_public: true,
        tags: [],
        creator_name: user?.user_metadata?.full_name || "",
        chat_url: "",
        screenshots: []
    });
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getAvailableFilters();
                setAvailableCategories(categories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newScreenshots = Array.from(files).map(file => URL.createObjectURL(file));
        setFormData(prev => ({
            ...prev,
            screenshots: [...prev.screenshots, ...newScreenshots]
        }));
    };

    const removeScreenshot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            screenshots: prev.screenshots.filter((_, i) => i !== index)
        }));
    };

    const getPreviewImage = (): string => {
        if (formData.avatar_url) {
            return formData.avatar_url;
        }
        const seed = formData.name || "default";
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, avatar_url: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createCompanion(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate form progress
    useEffect(() => {
        let progress = 0;
        if (formData.name) progress += 20;
        if (formData.description) progress += 20;
        if (formData.chat_url) progress += 20;
        if (formData.tags.length > 0) progress += 20;
        if (formData.screenshots.length > 0) progress += 20;
        setFormProgress(progress);
    }, [formData]);

    return (
        <div className="min-h-screen w-full bg-black p-4 md:p-8" role="main">
            {/* Matrix-style background overlay */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

            <div className="max-w-5xl mx-auto relative">
                <Card className="p-8 bg-black/50 backdrop-blur-sm border-green-500/20 space-y-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 rounded-full bg-green-500/10">
                            <Bot className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-500">
                                Submit Your Companion
                            </h1>
                            <p className="text-gray-400">
                                Share your AI companion with the Matrix Mingle community
                            </p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-400">
                            <span>Form Progress</span>
                            <span>{formProgress}% Complete</span>
                        </div>
                        <Progress value={formProgress} className="h-2 bg-green-500/20">
                            <div 
                                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                                style={{ width: `${formProgress}%` }}
                            />
                        </Progress>
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Preview
                        </h2>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <div className="flex justify-end gap-2 mb-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPreviewMode("desktop")}
                                                className={`${previewMode === "desktop" ? "bg-green-500/20" : ""} border-green-500/20`}
                                            >
                                                <Monitor className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Desktop Preview</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPreviewMode("mobile")}
                                                className={`${previewMode === "mobile" ? "bg-green-500/20" : ""} border-green-500/20`}
                                            >
                                                <Smartphone className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Mobile Preview</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Card className={`relative p-6 bg-black/60 backdrop-blur-sm border-green-500/20 ${
                                previewMode === "mobile" ? "max-w-[320px] mx-auto flex-col text-center" : "flex items-center gap-6"
                            }`}>
                                <img
                                    src={getPreviewImage()}
                                    alt="Avatar preview"
                                    className="w-24 h-24 rounded-full border-2 border-green-500/50"
                                />
                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold text-white mb-2">
                                        {formData.name || "Your Companion Name"}
                                    </h3>
                                    <p className="text-gray-400">
                                        {formData.description ||
                                            "Companion description will appear here"}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Screenshots Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                            <Image className="w-5 h-5" />
                            Screenshots
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {formData.screenshots.map((screenshot, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={screenshot}
                                        alt={`Screenshot ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeScreenshot(index)}
                                        className="absolute top-2 right-2 p-2 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ))}
                            <label className="flex items-center justify-center h-48 border-2 border-dashed border-green-500/20 rounded-lg cursor-pointer hover:bg-green-500/10 transition-colors">
                                <div className="text-center">
                                    <Upload className="w-6 h-6 mx-auto text-green-500" />
                                    <p className="text-sm text-gray-400 mt-2">
                                        Upload Screenshots
                                    </p>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleScreenshotUpload}
                                        className="hidden"
                                    />
                                </div>
                            </label>
                        </div>
                        <p className="text-xs text-gray-400">
                            Upload up to 5 screenshots (PNG, JPG, max 2MB each)
                        </p>
                    </div>

                    {/* Guidelines Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            Guidelines
                        </h2>
                        <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-lg relative overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-green-400 font-medium mb-3">Basic Information</h3>
                                    <ul className="text-sm text-gray-400 space-y-3 list-none">
                                        <li className="flex items-start gap-2">
                                            <Bot className="w-4 h-4 text-green-500 mt-0.5" />
                                            <span>Choose a memorable name that reflects your companion's personality</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Upload className="w-4 h-4 text-green-500 mt-0.5" />
                                            <span>Provide a clear avatar URL or let us generate one</span>
                                        </li>
                                    </ul>
                                </div>
                                {/* Discovery */}
                                <div>
                                    <h3 className="text-green-400 font-medium mb-3">Discovery</h3>
                                    <ul className="text-sm text-gray-400 space-y-3 list-none">
                                        <li className="flex items-start gap-2">
                                            <Link2 className="w-4 h-4 text-green-500 mt-0.5" />
                                            <span>Include the URL where users can chat with your companion</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                        <TabsList className="w-full bg-black/50 border border-green-500/20 p-1">
                            <TabsTrigger 
                                value="basics"
                                className="flex-1 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                            >
                                <Bot className="w-4 h-4 mr-2" />
                                Basic Info
                                {formData.name && formData.avatar_url && <Check className="w-4 h-4 ml-2 text-green-500" />}
                            </TabsTrigger>
                            <TabsTrigger 
                                value="content"
                                className="flex-1 data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400"
                            >
                                <Info className="w-4 h-4 mr-2" />
                                Content
                                {formData.description && <Check className="w-4 h-4 ml-2 text-green-500" />}
                            </TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <TabsContent value="basics" className="space-y-6">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                                        <Bot className="w-5 h-5" />
                                        Basic Information
                                    </h3>
                                    <div className="space-y-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Label htmlFor="name" className="text-gray-200 flex items-center gap-1 cursor-help">
                                                        Companion Name
                                                        <span className="text-green-500 text-sm">*</span>
                                                    </Label>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Choose a unique and memorable name that reflects your companion's purpose
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData({ ...formData, name: e.target.value })
                                            }
                                            className="bg-black/50 border-green-500/20 text-white focus:border-green-500 transition-colors"
                                            placeholder="e.g., PhilosopherBot"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Label htmlFor="avatar_url" className="text-gray-200 cursor-help">
                                                        Avatar URL
                                                    </Label>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Provide a URL to your companion's avatar image, or leave blank for an auto-generated one
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Input
                                            id="avatar_url"
                                            value={formData.avatar_url}
                                            onChange={handleAvatarChange}
                                            className="bg-black/50 border-green-500/20 text-white focus:border-green-500 transition-colors"
                                            placeholder="https://example.com/avatar.png"
                                            type="url"
                                        />
                                        <p className="text-xs text-gray-400">
                                            Leave blank for an auto-generated avatar
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Label htmlFor="chat_url" className="text-gray-200 flex items-center gap-1 cursor-help">
                                                        Chat URL
                                                        <span className="text-green-500 text-sm">*</span>
                                                    </Label>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    The URL where users can interact with your companion
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <Input
                                            id="chat_url"
                                            value={formData.chat_url}
                                            onChange={(e) =>
                                                setFormData({ ...formData, chat_url: e.target.value })
                                            }
                                            className="bg-black/50 border-green-500/20 text-white focus:border-green-500 transition-colors"
                                            placeholder="https://example.com/chat"
                                            type="url"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-gray-200">
                                        Categories
                                    </Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {availableCategories.map((category) => (
                                            <div key={category} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={category}
                                                    checked={formData.tags.includes(category)}
                                                    onCheckedChange={(checked) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            tags: checked
                                                                ? [...prev.tags, category]
                                                                : prev.tags.filter(id => id !== category)
                                                        }));
                                                    }}
                                                    className="border-green-500/50 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                                />
                                                <Label htmlFor={category} className="text-gray-300">
                                                    {category}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Select up to 3 categories that best describe your companion
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="space-y-6">
                                <h3 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    Content
                                </h3>
                                <div className="space-y-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Label htmlFor="description" className="text-gray-200 flex items-center gap-1 cursor-help">
                                                    Description
                                                    <span className="text-green-500 text-sm">*</span>
                                                </Label>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Describe your companion's personality, expertise, and unique features
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        className="bg-black/50 border-green-500/20 text-white min-h-[120px] focus:border-green-500 transition-colors"
                                        placeholder="Describe your companion's personality, expertise, and what makes them unique..."
                                        required
                                        maxLength={300}
                                    />
                                    <p className="text-xs text-gray-400 text-right">
                                        {formData.description.length}/300 characters
                                    </p>
                                </div>
                            </TabsContent>

                            {error && (
                                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                                    <AlertCircle className="w-5 h-5" />
                                    {error}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-8 border-t border-green-500/20">
                                <p className="text-sm text-gray-400">
                                    Your submission will be reviewed by our moderators
                                </p>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8"
                                    disabled={loading || formProgress < 100}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Submit Companion
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Tabs>
                </Card>
            </div>

            {/* Decorative Elements */}
            <>
                <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
                <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
            </>
        </div>
    );
};

export default SubmitCompanion;
