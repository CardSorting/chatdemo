import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Shield, Trash } from "lucide-react";

interface AccountActionsProps {
  onDeleteAccount: () => Promise<void>;
}

const AccountActions = ({ onDeleteAccount }: AccountActionsProps) => {
  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-green-500/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-red-500" />
        Account Actions
      </h3>

      <div className="space-y-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-black/90 border-red-500/20">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border-green-500/20 text-white hover:bg-green-500/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
};

export default AccountActions;
