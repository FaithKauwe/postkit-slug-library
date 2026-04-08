# TypeScript Project Setup Steps

## 1. Initialize Git

```bash
git init
```

Create a `.gitignore` file with the following contents:

```gitignore
node_modules/
dist/
```

## 2. Initialize npm

```bash
npm init -y
```

This creates `package.json` with default values. Edit it afterward to update the name, description, etc.

## 3. Install TypeScript

```bash
npm install -D typescript
```

Note: Cursor (and VS Code) come with built-in TypeScript *language support* — so `.ts` files will get syntax highlighting and type checking in the editor without installing anything. However, you still need `typescript` as a project dependency so that the `tsc` compiler is available for building, and so anyone who clones your repo can run `npm install` and have everything they need.

You can verify it installed correctly with:

```bash
npx tsc --version
```

## 4. Create tsconfig.json

```bash
npx tsc --init
```

Or create `tsconfig.json` manually. Here's a good starting point:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

## 5. Install a Test Framework (optional)

```bash
npm install -D vitest
```

## 6. Add npm Scripts

In `package.json`, add scripts for building and testing:

```json
"scripts": {
  "build": "tsc",
  "test": "vitest run"
}
```

## 7. Create Project Folders

```bash
mkdir src tests
```

## 8. Connect to a Remote Repository

Create a repo on GitHub (or another host), then link it:

```bash
git remote add origin <your-repo-url>
```

## 9. First Commit and Push

```bash
git add .
git commit -m "initial commit"
git push -u origin main
```

The `-u` flag sets the upstream so future pushes only need `git push`.
