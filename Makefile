init:

build:
		npm pack

clean:
		rm -rf ./*gantree-cli*.tgz

install:
		npm install ./gantree-cli*.tgz -g

uninstall:
		npm uninstall ./gantree-cli*.tgz -g

dev:
		make uninstall
		make build
		make install

.PHONY: init test
