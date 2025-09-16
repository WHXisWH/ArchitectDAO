# ArchitectDAO Changelog

All notable changes to the ArchitectDAO project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-09-05

### Added
#### Cross-Platform NFT Integration 🔗
- **External NFT Handler System**: Complete integration with Business Card Mockup platform
  - URL parameter parser supporting full NFT data structure from external platforms
  - Automated detection of NFT gifts from `nfc-dx-platform` source
  - Full-screen modal interface with comprehensive NFT information display
  - Copy-to-clipboard functionality for blockchain data (Token ID, Contract Address, IPFS CID)
  - Integration with existing gasless minting workflow
  - Test URL generator for development and testing

- **Enhanced URL Parameter Processing**: 
  - Validates contract addresses (Ethereum format)
  - Validates IPFS CID format
  - Comprehensive error handling and user feedback
  - Automatic URL cleanup to prevent duplicate processing

#### Dual-File Upload System 📁
- **Enhanced NFT Minting Workflow**:
  - **Primary File Upload**: Original design files (RVT, DWG, SKP, etc.) uploaded to IPFS
  - **Preview File Upload** (Optional): 3D models (GLB, GLTF, OBJ, FBX) for web visualization
  - Clear UI distinction between required and optional files
  - Enhanced file validation with type-specific feedback

- **3D Model Visualization System**:
  - Custom ModelViewer component using Google's `<model-viewer>` Web Component
  - Interactive 3D models with auto-rotate and camera controls
  - Progressive loading with elegant fallback states
  - Responsive design supporting different screen sizes
  - Error handling with graceful degradation

#### Enhanced NFT Display 🎨
- **Smart NFT Cards**:
  - Automatic 3D preview detection and display
  - Interactive 3D models replace static images when available
  - Purple "3D" badge for visual identification of 3D-enabled NFTs
  - Enhanced modal view with full 3D model interaction
  - Dual-mode support (3D preview + traditional image fallback)

- **Technical Storage Implementation**:
  - `URL.createObjectURL()` for temporary 3D model URLs (client-side)
  - localStorage persistence for preview model metadata
  - IPFS storage maintained for primary files
  - Browser compatibility with dynamic library loading

#### API Infrastructure Foundation 🔧
- **NFT API Endpoint** (`/api/nfts`): 
  - RESTful API ready for Business Card Mockup integration
  - Support for multiple NFT projects with comprehensive metadata
  - Query parameter support (tokenId filtering, result limits)
  - JSON response format with success/error handling
  - Example implementations for warehouse and datacenter BIM models

### Changed
- **MintNFTForm Component**: Extended to support dual-file upload workflow
- **NFTCard Component**: Enhanced to support 3D model display with automatic fallback
- **App Component**: ExternalNFTHandler now loads on app startup regardless of auth state
- **IPFS Upload Workflow**: Extended to handle both primary and preview files
- **Data Structures**: Updated interfaces to support preview model URLs and metadata

### Technical Details
- **Type Safety**: Full TypeScript support for new data structures
- **Error Handling**: Comprehensive error states for 3D loading, URL parsing, and file validation
- **Performance**: Progressive enhancement approach with lazy loading of 3D components
- **Browser Support**: Graceful degradation for browsers without WebGL support

### Development Experience
- **Testing URLs**: Automated generation of test URLs for external integration testing
- **Development Tools**: Enhanced debugging and logging for cross-platform data flow
- **Code Quality**: Maintained TypeScript strict mode compliance
- **Build System**: All new features pass type checking and production builds

### Future-Ready Architecture
- **Modular Design**: Easy extension for additional file types and preview formats
- **Scalable Storage**: Architecture ready for database integration when needed
- **Extensible Components**: 3D viewer component designed for future enhancement

---

## [2.0.0] - 2025-08-29

### Added
- Blueprint-style dark theme for login page
- Custom file upload component with drag-and-drop interface
- Multi-step NFT minting wizard (3 steps: Upload → Details → Preview)
- Skeleton loading states for marketplace
- Custom empty state for marketplace
- Shadcn/UI component library integration
- Custom hook architecture (`useNFTMint`, `useMarketplace`)

### Changed
- Complete UI/UX overhaul with modern design system
- Refactored NFT minting workflow for better user experience
- Improved marketplace loading and error states
- Enhanced typography system with consistent hierarchy

---

## [1.0.0] - 2025-08-27

### Added
- Smart contract deployment to Nero Testnet
- Real IPFS integration with Pinata service
- Account Abstraction for gasless transactions
- Web3Auth social login integration
- Complete NFT marketplace functionality
- Support for architectural file formats (.dwg, .rvt, .skp, etc.)

### Removed
- All mock data and placeholder content
- Redundant UI elements and advertising-like text

### Changed
- Updated from ETH to NERO token display
- Real blockchain integration replacing all mock interactions
- Production-ready environment configuration

---

## Development Notes

### Key Integration Points
1. **External Platform Support**: URL format `?action=mint&source=nfc-dx-platform&data={json}`
2. **3D Model Support**: GLB/GLTF files for web visualization alongside original design files
3. **Cross-Platform Data Flow**: Seamless integration between Business Card Mockup and ArchitectDAO
4. **Progressive Enhancement**: All features degrade gracefully on unsupported browsers

### Testing Recommendations
1. Test external NFT integration with provided test URLs
2. Upload dual files (RVT + GLB) to verify 3D preview functionality
3. Verify 3D model display on different devices and screen sizes
4. Test URL parameter parsing with various data formats

### Technical Debt
- Consider database integration for production-scale preview file storage
- Implement file size limits and optimization for 3D models
- Add caching strategies for frequently accessed 3D models
- Consider implementing file format conversion services