import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  MoreHorizontal,
  Plus,
  Trash,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import {
  Companion,
  createCompanion,
  deleteCompanion,
  fetchCompanions,
  updateCompanion,
  moderateCompanion,
} from "../../services/companion/companion";

const CompanionsPage = () => {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompanion, setEditingCompanion] = useState<Companion | null>(
    null,
  );
  const [moderationDialog, setModerationDialog] = useState<{
    open: boolean;
    companion?: Companion;
    feedback: string;
  }>({
    open: false,
    feedback: "",
  });
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    avatar_url: "",
    chat_url: "",
    tags: "",
  });

  useEffect(() => {
    loadCompanions();
  }, []);

  const loadCompanions = async () => {
    try {
      const data = await fetchCompanions(1);
      setCompanions(data);
    } catch (error) {
      console.error("Error loading companions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const companionData = {
        name: formData.name,
        description: formData.description,
        avatar_url:
          formData.avatar_url ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${formData.name}`,
        chat_url: formData.chat_url,
        creator_id: user?.id!,
        creator_name:
          profile?.full_name || user?.email?.split("@")[0] || "Anonymous",
        likes_count: 0,
        messages_count: 0,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      };

      if (editingCompanion) {
        await updateCompanion(editingCompanion.id, companionData);
      } else {
        await createCompanion(companionData);
      }

      await loadCompanions();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving companion:", error);
    }
  };

  const handleModerate = async (status: "active" | "pending" | "suspended") => {
    if (!moderationDialog.companion) return;

    try {
      await moderateCompanion(
        moderationDialog.companion.id,
        status
      );
      await loadCompanions();
      setModerationDialog({ open: false, feedback: "" });
    } catch (error) {
      console.error("Error moderating companion:", error);
    }
  };

  const handleEdit = (companion: Companion) => {
    setEditingCompanion(companion);
    setFormData({
      name: companion.name,
      description: companion.description,
      avatar_url: companion.avatar_url,
      chat_url: companion.chat_url,
      tags: companion.tags.join(", "),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this companion?")) {
      try {
        await deleteCompanion(id);
        await loadCompanions();
      } catch (error) {
        console.error("Error deleting companion:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      avatar_url: "",
      chat_url: "",
      tags: "",
    });
    setEditingCompanion(null);
  };

  const getStatusBadgeClass = (status: Companion["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500";
      case "suspended":
        return "bg-red-500/10 text-red-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Companions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Companion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-black/90 border-green-500/20">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCompanion ? "Edit Companion" : "Create Companion"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
                <Input
                  id="avatar_url"
                  value={formData.avatar_url}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar_url: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white"
                  placeholder="Leave blank for auto-generated avatar"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chat_url">Chat URL</Label>
                <Input
                  id="chat_url"
                  value={formData.chat_url}
                  onChange={(e) =>
                    setFormData({ ...formData, chat_url: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white"
                  placeholder="https://example.com/chat"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="bg-black/50 border-green-500/20 text-white"
                  placeholder="Philosophy, Art, Music"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {editingCompanion ? "Update Companion" : "Create Companion"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/50">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
        </TabsList>

        {["all", "pending", "active"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="rounded-lg border border-green-500/20 bg-black/50 backdrop-blur-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[70px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companions
                    .filter(
                      (companion) => tab === "all" || companion.status === tab,
                    )
                    .map((companion) => (
                      <TableRow key={companion.id}>
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center space-x-3">
                            <img
                              src={companion.avatar_url}
                              alt={companion.name}
                              className="h-8 w-8 rounded-full"
                            />
                            <span>{companion.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {companion.description}
                        </TableCell>
                        <TableCell>{companion.creator_name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {companion.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(companion.status)}`}
                          >
                            {companion.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-green-400"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px] bg-black/90 backdrop-blur-sm border-green-500/20"
                            >
                              {companion.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setModerationDialog({
                                        open: true,
                                        companion,
                                        feedback: "",
                                      })
                                    }
                                    className="text-green-400 hover:text-green-500 cursor-pointer"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Review
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem
                                onClick={() => handleEdit(companion)}
                                className="text-gray-400 hover:text-green-400 cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(companion.id)}
                                className="text-red-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Moderation Dialog */}
      <Dialog
        open={moderationDialog.open}
        onOpenChange={(open) => setModerationDialog({ open, feedback: "" })}
      >
        <DialogContent className="sm:max-w-[425px] bg-black/90 border-green-500/20">
          <DialogHeader>
            <DialogTitle className="text-white">Review Companion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback (optional)</Label>
              <Textarea
                id="feedback"
                value={moderationDialog.feedback}
                onChange={(e) =>
                  setModerationDialog((prev) => ({
                    ...prev,
                    feedback: e.target.value,
                  }))
                }
                className="bg-black/50 border-green-500/20 text-white"
                placeholder="Provide feedback for rejection..."
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleModerate("active")}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={() => handleModerate("suspended")}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Suspend
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanionsPage;
