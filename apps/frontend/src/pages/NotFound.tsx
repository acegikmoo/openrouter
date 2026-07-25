import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function NotFound() {
  return (
    <div className="dark min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 border border-primary/20 mx-auto mb-4">
          <Zap className="size-5 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground">Page not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
