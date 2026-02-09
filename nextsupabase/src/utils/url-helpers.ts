export function urlPath( applicationPath: string,tenant: string): string {

  return `/${tenant}${applicationPath}`;

}

export function buildUrl(applicationPath: string, tenant: string, request: Request): URL {

  return new URL(
    urlPath(applicationPath, tenant),
    request.url
    
  );
}
