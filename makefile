.PHONY: types build

build:
	nix-shell --command 'yarn build'

dev:
	nix-shell --command 'yarn dev'

install:
	nix-shell --command 'yarn install'

lint:
	nix-shell --command 'yarn run lint'

all: lint build

release:
	nix-shell --command 'yarn run release'
