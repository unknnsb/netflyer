# NetFlyer: Free + Ad-Free Movie/Series Streaming Platform

NetFlyer is a free and ad-free movie/series streaming platform. Anyone can use the code, but attribution is appreciated.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/AsNesbeer/netflyer.git
   ```

2. Install dependencies using yarn:

   ```bash
   yarn install
   ```

   Or npm:

   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` or rename it and fill in your own values. You can obtain Firebase and TMDB API keys by following these steps:

   ### Firebase Configuration

   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a new project or select an existing one.
   - Make sure to enable firestore and email and pass auth
   - Navigate to Project Settings > General.
   - Under Your apps, click on the Web app (</>) icon to register a new app.
   - Copy the config object's values into your `.env` file.

   ### TMDB API Key

   - Go to the [TMDB website](https://www.themoviedb.org/).
   - Sign up or log in to your account.
   - Navigate to Account Settings > API.
   - Request an API key if you don't have one already.
   - Copy your API key into your `.env` file.

4. Start the development server:

   ```bash
   yarn dev
   ```

   Or npm:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to view the application.

## Love My Work?

- Support My Work By Donating *TON*:
  `UQCv7Na2BE2VemPjUy27vh_wp49Gby08csoA3GooSpWEfu6b`

## Contribution

Feel free to fork and contribute to this project. If you have any ideas, bug fixes, or feature requests, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy streaming! 🍿🎬
