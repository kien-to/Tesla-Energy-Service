.PHONY: dev build serve lint clean

dev:
	npm run dev

build:
	npm run build

serve: build
	npm run start

lint:
	npm run lint

clean:
	rm -rf .next node_modules
