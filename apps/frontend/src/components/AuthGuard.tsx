import { useQuery } from "@tanstack/react-query";
import { useElysiaClient } from "@/providers/Eden";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const elysiaClient = useElysiaClient();
  const navigate = useNavigate();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await elysiaClient.auth.profile.get();
      if (response.error) throw new Error("Unauthorized");
      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (profileQuery.isError) {
      navigate("/signin", { replace: true });
    }
  }, [profileQuery.isError, navigate]);

  if (profileQuery.isPending) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="size-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (profileQuery.isError) {
    return null;
  }

  return children;
}
