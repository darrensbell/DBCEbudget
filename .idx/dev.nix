# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    (pkgs.python3.withPackages (ps: [
      ps.requests
    ]))
  ];
  # Sets environment variables in the workspace
  env = {
    SUPABASE_URL = "https://cimgeatqjoltbbeifnmi.supabase.co";
    SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbWdlYXRxam9sdGJiZWlmbm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzc0NzAsImV4cCI6MjA3MDc1MzQ3MH0.Du6LIN6i9v3Hly8tMC3SN5KLxv-8giiYgLhrI4y0hZc";
    SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbWdlYXRxam9sdGJiZWlmbm1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE3NzQ3MCwiZXhwIjoyMDcwNzUzNDcwfQ.E5A3GySnzAXzIA5CUP29UzlKtSZiuCW7xOToKQqnPsQ";
  };
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "google.gemini-cli-vscode-ide-companion"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm i --no-audit --no-progress --timing";
        # Open editors for the following files by default, if they exist:
        default.openFiles = [ "src/App.tsx" "src/App.ts" "src/App.jsx" "src/App.js" ];
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}
