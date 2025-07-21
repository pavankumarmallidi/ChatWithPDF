# 🔍 ChatWithPDF

**AI-Powered PDF Text Extraction & Analysis Platform with Responsive Design**

---

## How It Works

ChatWithPDF makes it easy to get answers and insights from your PDF documents, right from your browser. Here’s how it works:

1. **Upload Your PDF:**  
   Simply drag and drop your PDF file, or select it from your device.
2. **Instant Processing:**  
   The platform quickly reads your document, turning it into searchable text and understanding its structure.
3. **Ask Questions:**  
   You can chat with your PDF—just type your questions in plain English, like “What is the main topic of this document?” or “Summarize page 3.”
4. **Get Smart Answers:**  
   ChatWithPDF uses advanced AI to find the answers in your document and responds instantly, just like chatting with a real assistant.
5. **Works on Any Device:**  
   Whether you’re on your phone, tablet, or computer, the experience is smooth and easy to use.
6. **Stay Organized:**  
   You can review past documents, search through your files, and keep everything in one place.

---

# 🔍 PDFOCREXTRACTOR

**AI-Powered PDF Text Extraction & Analysis Platform with Responsive Design**

Transform your PDF documents into intelligent, searchable, and interactive content with advanced OCR technology, AI-powered analysis, and seamless multi-device experiences.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/supabase-latest-green.svg)](https://supabase.com/)
[![Responsive](https://img.shields.io/badge/responsive-design-brightgreen.svg)](RESPONSIVE_SYSTEM.md)
[![Deploy on Vercel](https://img.shields.io/badge/deploy-vercel-black.svg)](https://vercel.com/)

## 📸 Demo

**Live Demo**: [Coming Soon]

**Features Preview**:
- 📱 **Mobile-First Design**: Touch-optimized interface for smartphones
- 💻 **Tablet Experience**: Enhanced layouts for iPad and tablets  
- 🖥️ **Desktop Power**: Full-featured interface with advanced tools
- 🤖 **AI Chat**: Interactive conversations with your PDF content
- ⚡ **Real-time Processing**: Instant OCR and text extraction

## ✨ Features

### 🤖 **AI-Powered Analysis**
- Advanced OCR technology for precise text extraction
- Intelligent document structure recognition
- Multi-language support for global documents
- Content summarization and key insights
- Context-aware question answering with chat interface

### 💬 **Interactive Chat Interface**
- Ask questions about your PDF content in natural language
- Get instant answers from extracted text with AI assistance
- Contextual search within documents
- Smart suggestions and recommendations
- Real-time conversation history with persistent storage

### ⚡ **Lightning-Fast Processing**
- Real-time PDF analysis with progress tracking
- Efficient text extraction algorithms optimized for performance
- Support for large documents with background processing
- Visual feedback during extraction process
- Optimized for various PDF formats and quality levels

### 🔒 **Secure & Private**
- End-to-end encryption for document processing
- Secure cloud storage with Supabase
- GDPR compliant data handling
- User authentication and authorization
- Optional local processing for privacy-focused deployments

### 📱 **Responsive Multi-Device Experience**
- **Automatic Device Detection**: Smart detection of mobile, tablet, and desktop devices
- **Mobile-Optimized UI**: Touch-friendly interfaces with proper touch targets (44px minimum)
- **Tablet-Enhanced Layout**: Optimized for larger screens with better content organization
- **Desktop Full-Featured**: Complete experience with mouse interactions and keyboard shortcuts
- **Adaptive Components**: UI automatically adjusts based on screen size and device capabilities
- **Cross-Platform Compatibility**: Seamless experience across iOS, Android, and desktop browsers

### 🎨 **Modern Design System**
- Sophisticated dark theme with gray color palette
- Smooth animations and transitions powered by Framer Motion
- Intuitive drag-and-drop interface for file uploads
- Consistent typography and spacing using Tailwind CSS
- Accessibility-focused design following WCAG 2.1 AA guidelines

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm (or yarn)
- **Supabase account** for database and authentication
- **Modern web browser** with JavaScript enabled
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/PDF-OCR-EXTRACTOR.git
   cd PDF-OCR-EXTRACTOR
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Required: Supabase Configuration
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
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:8080`

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe development
- **Vite 6.3.5** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Framer Motion 12.15.0** - Smooth animations and transitions

### UI Components
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful and consistent icons
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **React Query (TanStack Query)** - Server state management
- **React Router DOM** - Client-side routing

### Development Tools
- **ESLint** - Code linting and consistency
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 Responsive Design System

### 🔍 **Automatic Device Detection**
The application automatically detects device characteristics:
- **Screen dimensions** and orientation
- **Touch capabilities** for mobile/tablet optimization
- **Platform detection** (iOS/Android) for native-like experiences
- **High DPI displays** for crisp graphics and text

### 🖥️ **Device-Specific Interfaces**

#### Mobile Experience (< 768px)
- **Touch-optimized navigation** with hamburger menus
- **Large touch targets** (minimum 44px) for better usability
- **Swipe gestures** and mobile-specific interactions
- **Single-column layouts** for optimal readability
- **Bottom navigation** for easy thumb access

#### Tablet Experience (768px - 1024px)
- **Two-column layouts** utilizing larger screen space
- **Enhanced content cards** with more information
- **Touch-friendly** but with more desktop-like features
- **Landscape/portrait optimization** for different orientations

#### Desktop Experience (> 1024px)
- **Multi-column layouts** for efficient space usage
- **Hover states** and mouse interactions
- **Keyboard navigation** support
- **Sidebar navigation** for quick access
- **Advanced features** like drag-and-drop

### 🎯 **Responsive Components**
- **ResponsiveLayout**: Automatically renders device-specific components
- **Device Detection Hooks**: Real-time device information
- **Responsive CSS Classes**: Adaptive typography, spacing, and grids
- **Conditional Rendering**: Show/hide content based on device type

## 📖 Usage

### Upload & Extract
1. **Upload PDF**: 
   - **Desktop**: Drag and drop or click to browse
   - **Mobile/Tablet**: Tap to select from device gallery
2. **Wait for Processing**: Watch real-time extraction progress with visual feedback
3. **Review Results**: View extracted text and document structure in device-optimized layout

### Interactive Analysis
1. **Ask Questions**: Use the chat interface optimized for your device
2. **Get Insights**: Receive AI-powered summaries and analysis
3. **Export Results**: Download extracted text or analysis reports

### Document Management
1. **Browse History**: Access previously processed documents in grid or list view
2. **Search Content**: Find specific information across all documents
3. **Organize Files**: Create collections and tags for better organization

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── mobile/         # Mobile-specific components
│   ├── tablet/         # Tablet-optimized components
│   ├── demo/           # Demo and testing components
│   └── ui/             # Base UI components (shadcn/ui)
├── hooks/              # Custom React hooks
│   ├── useDeviceDetection.tsx  # Device detection logic
│   └── use-mobile.tsx          # Legacy mobile detection
├── pages/              # Application pages/routes
├── services/           # API and external service integrations
├── lib/                # Utility functions and configurations
└── integrations/       # Third-party service integrations
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production with optimizations
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

### Code Style & Standards

This project follows modern development practices:
- **TypeScript** for comprehensive type safety
- **ESLint** for code linting and consistency
- **Tailwind CSS** for utility-first styling
- **Responsive Design Principles** for multi-device support
- **Accessibility Standards** (WCAG 2.1 AA)
- **Performance Optimization** for fast loading times

## 🔧 Configuration

### Responsive Breakpoints
```typescript
const BREAKPOINTS = {
  mobile: 768,    // Mobile devices
  tablet: 1024,   // Tablets and small laptops
  desktop: 1440,  // Desktop and large screens
};
```

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Enable Authentication with your preferred providers
3. Set up the following tables:
   ```sql
   -- User PDF data
   CREATE TABLE PDF_DATA_INFO (
     id SERIAL PRIMARY KEY,
     "EMAIL ID" TEXT NOT NULL,
     "PDF NAME" TEXT NOT NULL,
     "PDF SUMMARY" TEXT,
     "PAGES" INTEGER,
     "WORDS" INTEGER,
     "LANGUAGE" TEXT,
     "OCR OF PDF" TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   
   -- Chat history
   CREATE TABLE chat_history (
     id SERIAL PRIMARY KEY,
     user_email TEXT NOT NULL,
     pdf_id INTEGER REFERENCES PDF_DATA_INFO(id),
     message TEXT NOT NULL,
     is_user BOOLEAN NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### AI Service Integration

The application supports multiple AI providers:
- **OpenAI GPT** for advanced text analysis and chat
- **Custom AI endpoints** for specialized processing
- **Local processing** for privacy-focused deployments
- **Webhook integration** for real-time PDF processing

## 🚀 Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment with pre-configured settings:

1. **Deploy with GitHub Integration**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   
   # Connect to Vercel and deploy
   # Visit vercel.com and import your repository
   ```

2. **Set Environment Variables in Vercel Dashboard**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key  # Optional
   ```

3. **Deploy with Vercel CLI**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

### Other Deployment Options

#### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

#### Docker
```bash
# Build the container
docker build -t pdfocrextractor .

# Run with environment variables
docker run -p 8080:8080 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  pdfocrextractor
```

### Environment Variables for Production
```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional but recommended
VITE_OPENAI_API_KEY=your-openai-key
VITE_AI_SERVICE_URL=https://your-ai-service.com/api
```

## 🧪 Testing

### Responsive Testing
```bash
# Test responsive components
npm run test:responsive

# Visual regression testing
npm run test:visual

# Cross-browser testing
npm run test:browsers
```

### Device Testing Checklist
- [ ] Mobile portrait/landscape modes
- [ ] Tablet portrait/landscape modes
- [ ] Desktop various screen sizes
- [ ] Touch interactions work properly
- [ ] Keyboard navigation functional
- [ ] Screen reader compatibility

## 📊 Performance

### Optimization Features
- **Lazy loading** for device-specific components
- **Code splitting** by device type
- **Image optimization** for different pixel ratios
- **Efficient re-rendering** on device changes
- **Cached device detection** for better performance

### Performance Metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.0s

## 🤝 Contributing

We welcome contributions! Please follow our guidelines:

### Getting Started
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** our coding standards and responsive design principles
4. **Test** on multiple devices and screen sizes
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Development Guidelines

#### Code Quality
- Write TypeScript with comprehensive types
- Follow React best practices and hooks patterns
- Implement responsive design for all new components
- Add unit tests for new features
- Update documentation as needed

#### Responsive Design Standards
- Test on mobile, tablet, and desktop
- Ensure touch targets are minimum 44px
- Use semantic HTML for accessibility
- Implement proper keyboard navigation
- Follow WCAG 2.1 AA guidelines

#### Testing Requirements
- Unit tests for components and hooks
- Integration tests for user flows
- Responsive design testing
- Cross-browser compatibility testing
- Performance impact assessment

## 📚 Documentation

- **[Responsive System Guide](RESPONSIVE_SYSTEM.md)** - Comprehensive responsive design documentation
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions
- **[API Documentation](docs/api.md)** - Backend API reference (coming soon)
- **[Component Library](docs/components.md)** - UI component documentation (coming soon)

## 🐛 Troubleshooting

### Common Issues

#### Device Detection Not Working
```typescript
// Check if window is available (SSR compatibility)
if (typeof window !== 'undefined') {
  const deviceInfo = useDeviceDetection();
}
```

#### Layout Shifts on Device Change
```css
/* Use stable layout techniques */
.responsive-container {
  min-height: 100vh;
  transition: none; /* Avoid transitions during device detection */
}
```

#### Touch Events Not Responsive
```typescript
// Ensure touch events are properly handled
const handleTouch = (e: TouchEvent) => {
  e.preventDefault(); // Prevent default behavior
  // Handle touch logic
};
```

#### Build Issues
- Ensure Node.js version is 18+ (`node --version`)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

#### Environment Variables
- Ensure all variables are prefixed with `VITE_`
- Restart dev server after adding new variables
- Check browser console for missing variable errors

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Project Wiki](https://github.com/your-username/PDF-OCR-EXTRACTOR/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/PDF-OCR-EXTRACTOR/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/PDF-OCR-EXTRACTOR/discussions)
- **Responsive System**: [RESPONSIVE_SYSTEM.md](RESPONSIVE_SYSTEM.md)
- **Deployment Help**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for backend infrastructure and real-time features
- [React](https://reactjs.org/) for the powerful frontend framework
- [Vite](https://vitejs.dev/) for lightning-fast build tooling
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling and responsive design
- [Framer Motion](https://www.framer.com/motion/) for smooth animations and transitions
- [Lucide React](https://lucide.dev/) for beautiful and consistent icons
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [shadcn/ui](https://ui.shadcn.com/) for the component library

## 🌟 What's New

### v2.0.0 - Responsive Design System
- ✨ Automatic device detection and adaptive UI
- 📱 Mobile-first responsive components
- 💻 Tablet-optimized layouts
- 🖥️ Enhanced desktop experience
- 🎨 Sophisticated dark theme with gray palette
- ⚡ Improved performance and animations
- 🔧 Vercel deployment optimization

### Coming Soon
- 🌐 PWA support for mobile app-like experience
- 🗣️ Voice input for accessibility
- 📊 Advanced analytics and insights
- 🔄 Real-time collaboration features
- 🌍 Multi-language interface support
- 📱 Native mobile app versions

---

**Made with ❤️ for seamless document processing across all devices**

*Built with React, TypeScript, Vite, and Supabase*
