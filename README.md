# ArchitectDAO

[English](#english) | [日本語](#日本語)

---

## <a name="english"></a>English

ArchitectDAO is a decentralized platform based on blockchain technology, designed to activate the dormant intellectual property within the global architecture industry. It converts unselected design proposals, BIM/3D models, parametric scripts, and other digital assets into Non-Fungible Tokens (NFTs), providing them with verifiable ownership, transparent transaction histories, and a fair marketplace.

This platform aims to build a global digital asset ecosystem connecting enterprises, designers, and students to promote knowledge reuse and value innovation.

### **Technology Stack**

This project uses a modern Web3 technology stack to ensure the application is secure, efficient, and scalable.

#### **Blockchain**
*   **Smart Contract Language:** [Solidity](https://soliditylang.org/) - For writing smart contracts on the Ethereum Virtual Machine (EVM).
*   **Development Framework:** [Hardhat](https://hardhat.org/) - A professional Ethereum development environment for compiling, deploying, testing, and debugging smart contracts.
*   **Contract Standards:** [OpenZeppelin Contracts](https://www.openzeppelin.com/contracts) - Widely-used and security-audited smart contract libraries for implementing standards like ERC721 (NFTs), Ownable, etc.

#### **Frontend**
*   **Framework:** [React](https.reactjs.org/) - A JavaScript library for building user interfaces.
*   **Language:** [TypeScript](https://www.typescriptlang.org/) - Adds static typing to JavaScript, enhancing code maintainability and robustness.
*   **Build Tool:** [Vite](https://vitejs.dev/) - A next-generation frontend build tool that provides extremely fast cold starts and Hot Module Replacement (HMR).
*   **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
*   **Web3 Interaction:** [Ethers.js](https://ethers.io/) - A complete and compact library for interacting with the Ethereum blockchain and its ecosystem.

### **Project Structure**

The project follows a standard monorepo structure, separating the smart contracts and the frontend application into different directories for independent development and management.

```
/
├── contracts/          # Solidity smart contract source code
│   ├── ArchitectDAONFT.sol         # NFT Contract
│   └── ArchitectDAOMarketplace.sol # Marketplace Contract
│
├── scripts/            # Deployment scripts
│   └── deploy.js       # Hardhat deployment script
│
├── test/               # Contract test files
│   └── ArchitectDAO.test.cjs
│
├── src/                # Frontend application source code (React + TypeScript)
│   ├── components/     # Reusable React components
│   ├── contexts/       # React Context (e.g., for Web3 state management)
│   ├── contracts/      # ABIs (JSON interface files) for the smart contracts
│   ├── hooks/          # Custom React Hooks
│   ├── locales/        # Internationalization (i18n) configuration files
│   └── ...             # Other frontend assets
│
├── hardhat.config.cjs  # Hardhat configuration file
├── package.json        # Project dependencies and script configurations
└── README.md           # Project documentation
```

### **Getting Started**

Follow these steps to set up and run the project locally.

#### **Prerequisites**
*   [Node.js](https://nodejs.org/) (v18 or later)
*   [pnpm](https://pnpm.io/) (recommended) or npm/yarn

#### **1. Clone & Install**

Clone the project repository and install the dependencies:

```bash
git clone <repository-url>
cd ArchitectDAO
pnpm install
```

#### **2. Configure Environment Variables**

Copy the `.env.example` file to `.env`. Then, fill in the necessary environment variables, such as your private key and RPC URL.

```bash
cp .env.example .env
```

#### **3. Compile Smart Contracts**

Compile the smart contracts using Hardhat. This will generate the ABI and bytecode for the contracts in the `artifacts` directory.

```bash
npx hardhat compile
```

#### **4. Deploy Smart Contracts**

Deploy the smart contracts to your chosen network (e.g., a local Hardhat network or a testnet).

```bash
# Example: Deploy to a local network
npx hardhat run scripts/deploy.js --network localhost
```

After deployment, update the frontend configuration with the new contract addresses.

#### **5. Run the Frontend Application**

Start the Vite development server:

```bash
pnpm run dev
```

The application will start locally (usually at `http://localhost:5173`).

---

## <a name="japanese"></a>日本語

ArchitectDAOは、ブロックチェーン技術を基盤とした分散型プラットフォームであり、世界の建築業界に眠る知的財産を活性化させることを目的としています。選ばれなかった設計案、BIM/3Dモデル、パラメトリックスクリプトなどのデジタル資産を非代替性トークン（NFT）に変換し、検証可能な所有権、透明な取引履歴、公正なマーケットプレイスを提供します。

このプラットフォームは、企業、デザイナー、学生をつなぐグローバルなデジタル資産エコシステムを構築し、知識の再利用と価値の再創造を促進することを目指しています。

### **技術スタック (Technology Stack)**

このプロジェクトは、アプリケーションの安全性、効率性、スケーラビリティを確保するために、最新のWeb3技術スタックを採用しています。

#### **ブロックチェーン (Blockchain)**
*   **スマートコントラクト言語:** [Solidity](https://soliditylang.org/) - イーサリアム仮想マシン（EVM）上で実行されるスマートコントラクトを記述するための言語。
*   **開発フレームワーク:** [Hardhat](https://hardhat.org/) - スマートコントラクトのコンパイル、デプロイ、テスト、デバッグを行うためのプロフェッショナルなイーサリアム開発環境。
*   **コントラクト標準:** [OpenZeppelin Contracts](https://www.openzeppelin.com/contracts) - ERC721（NFT）やOwnableなどの標準を実装するために広く利用されている、セキュリティ監査済みのスマートコントラクトライブラリ。

#### **フロントエンド (Frontend)**
*   **フレームワーク:** [React](https.reactjs.org/) - ユーザーインターフェースを構築するためのJavaScriptライブラリ。
*   **言語:** [TypeScript](https://www.typescriptlang.org/) - JavaScriptに静的型付けを追加し、コードの保守性と堅牢性を向上させます。
*   **ビルドツール:** [Vite](https://vitejs.dev/) - 非常に高速なコールドスタートとホットモジュールリプレイスメント（HMR）を提供する次世代フロントエンドビルドツール。
*   **CSSフレームワーク:** [Tailwind CSS](https://tailwindcss.com/) - カスタムデザインを迅速に構築するためのユーティリティファーストCSSフレームワーク。
*   **Web3連携:** [Ethers.js](https://ethers.io/) - イーサリアムブロックチェーンおよびそのエコシステムと対話するための完全かつコンパクトなライブラリ。

### **プロジェクト構造 (Project Structure)**

このプロジェクトは標準的なモノレポ構造を採用しており、スマートコントラクトとフロントエンドアプリケーションを別々のディレクトリに分けることで、独立した開発と管理を容易にしています。

```
/
├── contracts/          # Solidityスマートコントラクトのソースコード
│   ├── ArchitectDAONFT.sol         # NFTコントラクト
│   └── ArchitectDAOMarketplace.sol # マーケットプレイスコントラクト
│
├── scripts/            # デプロイスクリプト
│   └── deploy.js       # Hardhatデプロイスクリプト
│
├── test/               # コントラクトのテストファイル
│   └── ArchitectDAO.test.cjs
│
├── src/                # フロントエンドアプリケーションのソースコード (React + TypeScript)
│   ├── components/     # 再利用可能なReactコンポーネント
│   ├── contexts/       # React Context（例：Web3の状態管理用）
│   ├── contracts/      # スマートコントラクトのABI（JSONインターフェースファイル）
│   ├── hooks/          # カスタムReact Hooks
│   ├── locales/        # 国際化（i18n）設定ファイル
│   └── ...             # その他のフロントエンド資産
│
├── hardhat.config.cjs  # Hardhat設定ファイル
├── package.json        # プロジェクトの依存関係とスクリプト設定
└── README.md           # プロジェクトドキュメント
```

### **利用方法 (Getting Started)**

以下の手順に従って、ローカルでプロジェクトをセットアップして実行します。

#### **前提条件**
*   [Node.js](https://nodejs.org/) (v18以降)
*   [pnpm](https://pnpm.io/) (推奨) または npm/yarn

#### **1. クローンとインストール**

プロジェクトリポジトリをクローンし、依存関係をインストールします。

```bash
git clone <repository-url>
cd ArchitectDAO
pnpm install
```

#### **2. 環境変数の設定**

`.env.example` ファイルをコピーして `.env` という名前に変更します。その後、秘密鍵やRPC URLなど、必要な環境変数を入力します。

```bash
cp .env.example .env
```

#### **3. スマートコントラクトのコンパイル**

Hardhatを使用してスマートコントラクトをコンパイルします。これにより、コントラクトのABIとバイトコードが `artifacts` ディレクトリに生成されます。

```bash
npx hardhat compile
```

#### **4. スマートコントラクトのデプロイ**

選択したネットワーク（例：ローカルのHardhatネットワークやテストネット）にスマートコントラクトをデプロイします。

```bash
# 例：ローカルネットワークへのデプロイ
npx hardhat run scripts/deploy.js --network localhost
```

デプロイ後、生成されたコントラクトアドレスをフロントエンドの設定ファイルに更新してください。

#### **5. フロントエンドアプリケーションの実行**

Vite開発サーバーを起動します。

```bash
pnpm run dev
```

アプリケーションがローカルで起動します（通常は `http://localhost:5173`）。