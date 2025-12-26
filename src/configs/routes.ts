export type RouteConfig = {
  requiresAuth: boolean;
  layout?: "auth" | "app" | "minimal";
};

export const routeConfig: Record<string, RouteConfig> = {
  "/": { requiresAuth: true, layout: "app" },
  "/auth/create-session": { requiresAuth: false, layout: "auth" },
  "/auth/restore-token": { requiresAuth: false, layout: "auth" },
  "/dashboard": { requiresAuth: true, layout: "app" },
};

export function getRouteConfig(pathname: string): RouteConfig {
  return routeConfig[pathname] || { requiresAuth: false };
}
