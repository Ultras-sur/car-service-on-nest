{ pkgs }: {
	deps = [
		pkgs.postgresql_14
  pkgs.lsof
  pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
	];
}