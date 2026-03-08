.PHONY: dev build serve lint test clean

dev:
	npm run dev

build:
	npm run build

serve: build
	npm run start

test:
	npm test

lint:
	npm run lint

clean:
	rm -rf .next node_modules
