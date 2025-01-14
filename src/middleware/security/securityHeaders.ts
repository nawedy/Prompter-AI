export class SecurityHeaders {
  enhance(res: Response): Response {
    const headers = new Headers(res.headers);

    // Content Security Policy
    headers.set('Content-Security-Policy', [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.supabase.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '));

    // Other security headers
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('X-XSS-Protection', '1; mode=block');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 
      'camera=(), microphone=(), geolocation=(), payment=()'
    );
    headers.set('Strict-Transport-Security', 
      'max-age=31536000; includeSubDomains; preload'
    );

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers
    });
  }
}