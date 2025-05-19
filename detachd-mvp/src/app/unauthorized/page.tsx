export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-xl text-muted-foreground mb-8">
          You don't have permission to access this page.
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-lg font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          Return to Login
        </a>
      </div>
    </div>
  );
} 