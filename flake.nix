{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
    fenix.url = "github:nix-community/fenix";
    fenix.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, fenix, flake-utils }:
    flake-utils.lib.eachDefaultSystem
      (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          fenixPackages = fenix.packages.${system};
          rustToolchain = fenixPackages.fromToolchainFile {
            file = ./rust-toolchain.toml;
            sha256 = "sha256-PZbOSw+520ocE9LBzkwzEduQTqqNstPb4VdCzl3FNwk=";
          };
        in
        {
          devShells.default = pkgs.mkShell {
            buildInputs = [
              pkgs.wasm-pack
              pkgs.wasm-bindgen-cli
              pkgs.binaryen
              rustToolchain
              fenixPackages.rust-analyzer
              # TODO: make this conditional for macos
              # https://github.com/NixOS/nixpkgs/issues/120688
              pkgs.libiconv
            ];
          };

        }
      );
}
