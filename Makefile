init:

build:
		npm pack

clean:
		rm -rf ./*gantree-lib*.tgz

install:
		npm install ./gantree-lib*.tgz -g

uninstall:
		npm uninstall ./gantree-lib*.tgz -g

dev:
		make uninstall
		make build
		make install

.PHONY: init test
