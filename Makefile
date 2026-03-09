.PHONY: dev run build serve lint test deploy clean

dev:
	npm install
	npm run dev

run:
	npm run dev

build:
	npm run build

serve: build
	npm run start

test:
	npm test

lint:
	npm run lint

deploy:
	npx vercel build --prod
	npx vercel --prebuilt --prod

clean:
	rm -rf .next node_modules
