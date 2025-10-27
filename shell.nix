let
  pkgs = import <nixpkgs> { };
in
pkgs.mkShell {
  packages = with pkgs; [
    nodejs_22
    corepack_22
    docker-buildx
    docker
    openssl
  ];
}
