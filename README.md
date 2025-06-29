# Codeforces Problem Selector

A modern, interactive web application that helps competitive programmers discover random Codeforces problems based on their preferred difficulty levels and topics. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Smart Problem Selection**: Get 5 random problems matching your criteria
- **Difficulty Range Filtering**: Select problems from 800 to 3500 rating
- **Topic-Based Filtering**: Filter by 30+ problem topics (greedy, dp, graphs, etc.)
- **Official Codeforces Integration**: Uses the official Codeforces API
- **Beautiful UI**: Modern glassmorphism design with Codeforces color scheme
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Validation**: Form validation and error handling
- **Direct Problem Links**: One-click access to problems on Codeforces

## 🎯 How It Works

1. **Select Topic** (Optional): Choose from 30+ problem topics or leave as "All Topics"
2. **Set Difficulty Range**: Pick starting and ending difficulty ratings
3. **Generate Problems**: Click to get 5 random problems matching your criteria
4. **Solve & Improve**: Click on any problem to open it directly on Codeforces



## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Codeforces Problemset API
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeforces-problem-selector
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)



## 🎯 Available Topics

The app supports filtering by these problem topics:
- 2-sat, binary search, bitmasks, brute force
- combinatorics, constructive algorithms
- data structures, dfs and similar, divide and conquer
- dp, dsu, expression parsing, fft, flow
- games, geometry, graph matchings, graphs
- greedy, hashing, implementation, interactive
- math, matrices, number theory, probabilities
- shortest paths, sortings, strings
- ternary search, trees, two pointers

## 🔧 API Integration

The application integrates with the [Codeforces Problemset API](https://codeforces.com/apiHelp/method#problemset.problems) to fetch problem data in real-time.



## 🚀 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Deploy with zero configuration

## 👨‍💻 Author

**Bikash Kumar Yadav**

Made with ❤️ for the competitive programming community.

#
**Happy Coding! 🚀**
