"use client"

import React from "react";
import { Shield, XCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
    title?: string;
    description?: string;
    errorCode?: string;
    showContactSupport?: boolean;
    onRetry?: () => void;
    onContactSupport?: () => void;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
    title = "Access Denied",
    description = "You don't have permission to access this resource. Please contact your administrator or try signing in with a different account.",
    errorCode = "403 - Forbidden",
    showContactSupport = true,
    onRetry = () => console.log("Retry clicked"),
    onContactSupport = () => console.log("Contact support clicked")
}) => {

    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <div className="text-center space-y-6">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center">
                                <Shield className="w-12 h-12 text-destructive" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-destructive-foreground" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Error Code */}
                    <div className="bg-muted/50 border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-muted-foreground">{errorCode}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button
                            onClick={onRetry}
                            className="w-full cursor-pointer"
                            variant="default"
                        >
                            Try Again
                        </Button>

                        {showContactSupport && (
                            <AlertDialog>
                                <Button variant="outline" className="w-full cursor-pointer" onClick={router.back}>
                                    Go back
                                </Button>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Contact Support</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Our support team will help you resolve this access issue. Please provide the error code {errorCode} when contacting support.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>

                    {/* Additional Help */}
                    <div className="pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                            If you believe this is an error, please check your permissions or contact your system administrator.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Denied() {
    return (
        <AccessDenied
            title="Access Denied"
            description="You don't have permission to access this resource. Please contact your administrator or try signing in with a different account."
            errorCode="403 - Forbidden"
            showContactSupport={true}
            onRetry={() => window.location.reload()}
        />
    );
}
