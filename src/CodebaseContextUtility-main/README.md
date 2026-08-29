<!-- Codebase Context Utility -->

<h1 align="center">Codebase Context Utility 🧠✨</h1>

<p align="center">
  <b>AI-Ready Context Generation for Your Codebase</b><br/>
  <a href="#-features">Features</a> • <a href="#-tech">Tech Stack</a> • <a href="#-getting-started">Getting Started</a> • <a href="#-usage">Usage</a> • <a href="#-architecture">Architecture</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License"/>
</p>

---

<p align="center">
  <img src="https://raw.githubusercontent.com/DigitalHerencia/CodebaseContextUtility/refs/heads/main/public/Screenshot_4-9-2025_162543_codebase-context-utility.vercel.app.jpeg" alt="CodebaseContextUtility Screenshot" width="100%" style="border-radius:12px;margin:1rem 0;">
</p>

---

> **Codebase Context Utility** is a developer-first tool that transforms entire codebases into **LLM-ready context** for AI-assisted workflows.  
> It provides deep file system integration, dependency mapping, and token-aware exports to make working with large projects seamless. 🚀

---

## ✨ Features

- **📁 File System Integration:** Select folders locally with native FS access  
- **🖱️ Drag-and-Drop Interface:** Quickly add files and folders to your workspace  
- **🧠 Smart Context Generation:** Create optimized context chunks for GPT and other LLMs  
- **📊 Multiple Export Formats:** JSON, Markdown, Plaintext output options  
- **🔍 Code Analysis:** AST parsing, language detection, syntax-aware insights  
- **📈 Token Estimation:** Calculate token usage per model/provider  
- **🎯 Dependency Mapping:** Visualize relationships between files and modules  
- **⚡ Architecture Visualization:** Generate project-wide architecture diagrams  
- **🔧 Advanced Filtering:** Include/exclude via glob patterns, extensions  
- **🌗 Modern UI:** Responsive design, dark/light themes, keyboard shortcuts  

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript 5  
- **Styling:** Tailwind CSS v4, Radix UI, Shadcn/ui, Lucide React Icons  
- **Code Analysis:** Babel Parser, AST Traversal, custom token estimator  
- **File System:** File System Access API, Drag & Drop API  
- **State Management:** React Context + Custom Hooks  
- **Utilities:** React Resizable Panels, React Hook Form, clsx  
- **DX:** ESLint, PostCSS, Autoprefixer, pnpm/npm  

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 18+  
- **Package Manager:** npm 9+ / pnpm  
- **Browser:** Chrome/Edge/Brave with File System Access API  

### Quick Start

```bash
git clone https://github.com/DigitalHerencia/CodebaseContextUtility.git
cd CodebaseContextUtility
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start analyzing your codebase.

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

---

## 📖 Usage

### 1. **Load Your Codebase**
- Click "Open Directory" to select a local folder
- Or drag and drop files/folders into the interface
- Use the file tree to navigate your project structure

### 2. **Configure Analysis**
- Set file extension filters (js, ts, tsx, py, etc.)
- Configure exclude patterns (node_modules, .git, dist)
- Adjust token limits and export preferences

### 3. **Generate Context**
- Select your preferred output format (JSON/Markdown/Plain Text)
- Click "Generate Context" to create LLM-ready analysis
- Export or copy the generated context for use with AI tools

### 4. **Advanced Features**
- View dependency relationships between files
- Generate architecture overviews
- Estimate token counts for different LLM models
- Filter and customize output based on your needs

---

## 🏗️ Architecture

The utility processes your codebase through several intelligent stages:

1. **File System Scanning**: Recursively analyzes directory structure
2. **Content Processing**: Reads and parses file contents with language detection
3. **Dependency Mapping**: Identifies imports, exports, and inter-file relationships
4. **Metadata Extraction**: Gathers file statistics, sizes, and structural information
5. **Context Assembly**: Combines all data into coherent, LLM-optimized format
6. **Token Optimization**: Applies limits and formatting for target LLM models

---

## 🤝 Development Workflow

- **Branch Names**: `feature/xyz`, `fix/abc`, `docs/xyz`
- **Commit Format**: Conventional commits with clear, descriptive messages
- **Code Quality**: ESLint for code standards, TypeScript for type safety
- **UI Components**: Consistent usage of Shadcn/ui component library
- **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## 📝 License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <b>Codebase Context Utility – Empowering AI-Assisted Development 🧠✨</b>
</p>

<!-- End of README -->
