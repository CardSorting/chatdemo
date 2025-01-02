import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { useAuth } from "../../lib/auth";
import { createCompanion } from "../../services/companion/companion";
import { Bot, Loader2, Info, Upload, Sparkles, Tags, Link2, AlertCircle } from "lucide-react";

const SubmitCompanion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        avatar_url: "",
        creator_name: user?.user_metadata?.full_name || "",
        tags: [] as string[],
        chat_url: ""
    });

    const getPreviewImage = () => {
        return formData.avatar_url || "https://via.placeholder.com/150";
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, avatar_url: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await createCompanion({
                ...formData,
                tags: formData.tags
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black p-4 md:p-8">
            {/* Matrix-style background overlay */}
            <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMCwyNTUsMCwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20 pointer-events-none animate-matrix-rain" />

            <div className="max-w-5xl mx-auto relative">
                <Card className="p-8 bg-black/50 backdrop-blur-sm border-green-500/20 space-y-12">
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

                    {/* Preview Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Preview
                        </h2>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative p-6 bg-black/60 backdrop-blur-sm border-green-500/20 flex items-center gap-6">
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
                                {formData.tags.length > 0 && (
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {formData.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                        </div>
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
                                            <Tags className="w-4 h-4 text-green-500 mt-0.5" />
                                            <span>Add relevant tags to help users discover your companion (e.g., "Philosophy", "Science")</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Link2 className="w-4 h-4 text-green-500 mt-0.5" />
                                            <span>Include the URL where users can chat with your companion</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Form Fields */}
                        <div className="space-y-8">
                            <h2 className="text-xl font-semibold text-green-400 flex items-center gap-2">
                                <Bot className="w-5 h-5" />
                                Companion Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <h3 className="text-green-400 font-medium">Basic Information</h3>
                                    <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-200 flex items-center gap-1">
                                        Companion Name
                                        <span className="text-green-500 text-sm">*</span>
                                    </Label>
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
                                    <Label htmlFor="avatar_url" className="text-gray-200">
                                        Avatar URL
                                    </Label>
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
                                    <Label htmlFor="chat_url" className="text-gray-200 flex items-center gap-1">
                                        Chat URL
                                        <span className="text-green-500 text-sm">*</span>
                                    </Label>
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
                                </div>

                                <div className="space-y-8">
                                    <h3 className="text-green-400 font-medium">Content & Discovery</h3>
                                    <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-200 flex items-center gap-1">
                                        Description
                                        <span className="text-green-500 text-sm">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        className="bg-black/50 border-green-500/20 text-white min-h-[120px] focus:border-green-500 transition-colors"
                                        placeholder="Describe your companion's personality, expertise, and what makes them unique..."
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags" className="text-gray-200 flex items-center gap-1">
                                        Tags
                                        <span className="text-green-500 text-sm">*</span>
                                    </Label>
                                    <Input
                                        id="tags"
                                        value={formData.tags.join(', ')}
                                        onChange={(e) =>
                                            setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })
                                        }
                                        className="bg-black/50 border-green-500/20 text-white focus:border-green-500 transition-colors"
                                        placeholder="e.g., Philosophy, Science, Art (comma-separated)"
                                        required
                                    />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
                                disabled={loading}
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
                </Card>
            </div>

            {/* Decorative Elements */}
            <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
            <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        </div>
    );
};

export default SubmitCompanion;
