with import <nixpkgs> {};
stdenv.mkDerivation {
  name = "env";
  buildInputs = [
    python3
    python3Packages.flask
  ];
}
