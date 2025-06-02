# 🔍 PDFOCREXTRACTOR

**AI-Powered PDF Text Extraction & Analysis Platform**

Transform your PDF documents into intelligent, searchable, and interactive content with advanced OCR technology and AI-powered analysis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)
![Supabase](https://img.shields.io/badge/supabase-latest-green.svg)

## ✨ Features

### 🤖 **AI-Powered Analysis**
- Advanced OCR technology for precise text extraction
- Intelligent document structure recognition
- Multi-language support for global documents
- Content summarization and key insights

### 💬 **Interactive Chat Interface**
- Ask questions about your PDF content
- Get instant answers from extracted text
- Contextual search within documents
- Smart suggestions and recommendations

### ⚡ **Lightning-Fast Processing**
- Real-time PDF analysis
- Efficient text extraction algorithms
- Optimized for large documents
- Background processing capabilities

### 🔒 **Secure & Private**
- End-to-end encryption
- Local processing options
- Secure cloud storage with Supabase
- GDPR compliant data handling

### 📱 **Modern User Experience**
- Responsive design for all devices
- Intuitive drag-and-drop interface
- Real-time progress tracking
- Dark/light theme support

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (for database and authentication)
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/PDF-OCR-EXTRACTOR.git
   cd PDF-OCR-EXTRACTOR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional: AI Service Configuration
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_AI_SERVICE_URL=your_ai_service_endpoint
   ```

4. **Database Setup**
   
   Run the Supabase migrations:
   ```bash
   npx supabase db reset
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

## 📖 Usage

### Upload & Extract
1. **Upload PDF**: Drag and drop your PDF file or click to browse
2. **Wait for Processing**: Watch real-time extraction progress
3. **Review Results**: View extracted text and document structure

### Interactive Analysis
1. **Ask Questions**: Use the chat interface to query your document
2. **Get Insights**: Receive AI-powered summaries and analysis
3. **Export Results**: Download extracted text or analysis reports

### Document Management
1. **Browse History**: Access previously processed documents
2. **Search Content**: Find specific information across all documents
3. **Organize Files**: Create collections and tags for better organization

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages/routes
├── services/           # API and external service integrations
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
└── integrations/       # Third-party service integrations
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style

This project uses:
- **ESLint** for code linting
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Prettier** for code formatting (recommended)

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Authentication with your preferred providers
3. Set up the following tables:
   - `users` - User management
   - `pdfs` - PDF document metadata
   - `extractions` - OCR extraction results
   - `chats` - Chat history and interactions

### AI Service Integration

The application supports multiple AI providers:
- **OpenAI GPT** for advanced text analysis
- **Custom AI endpoints** for specialized processing
- **Local processing** for privacy-focused deployments

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t pdfocrextractor .
docker run -p 8080:8080 pdfocrextractor
```

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Write TypeScript with proper types
- Follow React best practices
- Add tests for new features
- Update documentation as needed
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/PDF-OCR-EXTRACTOR/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/PDF-OCR-EXTRACTOR/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/PDF-OCR-EXTRACTOR/discussions)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for backend infrastructure
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for build tooling

---

**Made with ❤️ for better document processing**
