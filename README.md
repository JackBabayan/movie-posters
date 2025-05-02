# Movie Posters

A modern web application for browsing and discovering movies, built with Next.js and TypeScript. The application features a beautiful UI, infinite scroll, movie search, genre filtering, and a dark/light theme switcher.

## Features

- 🎬 Browse popular movies with infinite scroll
- 🔍 Search movies by title
- 🎭 Filter movies by genre
- 🌓 Dark/Light theme support
- 💖 Add movies to favorites
- 📱 Responsive design
- 🎥 Movie details with trailers and cast information

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [SWR](https://swr.vercel.app/) - Data fetching
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [SCSS Modules](https://sass-lang.com/) - Styling
- [TMDB API](https://www.themoviedb.org/documentation/api) - Movie data

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/movie-posters.git
cd movie-posters
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your TMDB API key:

```bash
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── common/      # Shared components
│   ├── home/        # Home page components
│   └── movie/       # Movie detail components
├── lib/             # Utilities and API clients
├── styles/          # Global styles and icons
├── types/           # TypeScript type definitions
└── utils/           # Helper functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
