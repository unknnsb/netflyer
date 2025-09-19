import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BACKEND_URL } from "../services/Api";
import {
  Image,
  Spinner,
  Select,
  SelectItem,
  Button,
  Chip,
  Card,
  CardBody,
  Pagination,
  Slider
} from "@heroui/react";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Calendar,
  X,
  SlidersHorizontal,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Discover = () => {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [genres, setGenres] = useState({ movie: [], tv: [] });
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    rating: [
      parseFloat(searchParams.get('rating_min')) || 0,
      parseFloat(searchParams.get('rating_max')) || 10
    ],
    sort_by: searchParams.get('sort_by') || 'popularity.desc',
    page: parseInt(searchParams.get('page')) || 1
  });

  const sortOptions = [
    { key: 'popularity.desc', label: 'Most Popular' },
    { key: 'popularity.asc', label: 'Least Popular' },
    { key: 'vote_average.desc', label: 'Highest Rated' },
    { key: 'vote_average.asc', label: 'Lowest Rated' },
    { key: 'release_date.desc', label: 'Newest First' },
    { key: 'release_date.asc', label: 'Oldest First' },
    { key: 'title.asc', label: 'A-Z' },
    { key: 'title.desc', label: 'Z-A' }
  ];

  const typeOptions = [
    { key: 'all', label: 'All Content' },
    { key: 'movie', label: 'Movies' },
    { key: 'tv', label: 'TV Series' }
  ];

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchResults();
    updateURL();
  }, [filters]);

  const fetchGenres = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/genres`);
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: filters.type,
        sort_by: filters.sort_by,
        page: filters.page.toString()
      });

      if (filters.genre) params.append('genre', filters.genre);
      if (filters.year) params.append('year', filters.year);
      if (filters.rating[0] > 0) params.append('rating_min', filters.rating[0].toString());
      if (filters.rating[1] < 10) params.append('rating_max', filters.rating[1].toString());

      const response = await fetch(`${BACKEND_URL}/api/discover?${params}`);
      const data = await response.json();

      setResults(data.results || []);
      setTotalPages(data.total_pages || 1);
      setTotalResults(data.total_results || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching results:", error);
      setLoading(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'rating') {
        if (value[0] > 0) params.set('rating_min', value[0].toString());
        if (value[1] < 10) params.set('rating_max', value[1].toString());
      } else if (value && value !== 'all' && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      genre: '',
      year: '',
      rating: [0, 10],
      sort_by: 'popularity.desc',
      page: 1
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.genre) count++;
    if (filters.year) count++;
    if (filters.rating[0] > 0 || filters.rating[1] < 10) count++;
    return count;
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push({ key: year.toString(), label: year.toString() });
    }
    return years;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Discover
            </h1>
            <p className="text-zinc-400 text-lg">
              {totalResults.toLocaleString()} results found
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 p-1 bg-zinc-900 rounded-xl">
              <Button
                isIconOnly
                variant={viewMode === 'grid' ? 'solid' : 'light'}
                color="primary"
                size="sm"
                className="rounded-lg"
                onPress={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === 'list' ? 'solid' : 'light'}
                color="primary"
                size="sm"
                className="rounded-lg"
                onPress={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="bordered"
              startContent={<SlidersHorizontal className="w-4 h-4" />}
              onPress={() => setShowFilters(!showFilters)}
              className="relative rounded-xl border-zinc-700 hover:border-zinc-600"
            >
              Filters
              {getActiveFiltersCount() > 0 && (
                <Chip size="sm" color="primary" className="absolute -top-2 -right-2 min-w-6 h-6">
                  {getActiveFiltersCount()}
                </Chip>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
                <CardBody className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Advanced Filters</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        onPress={clearFilters}
                        startContent={<X className="w-4 h-4" />}
                        className="rounded-lg"
                      >
                        Clear All
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onPress={() => setShowFilters(false)}
                        className="rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-3 text-zinc-300">Content Type</label>
                      <Select
                        selectedKeys={[filters.type]}
                        onSelectionChange={(keys) => handleFilterChange('type', Array.from(keys)[0])}
                        className="w-full"
                        radius="lg"
                        variant="bordered"
                      >
                        {typeOptions.map((option) => (
                          <SelectItem key={option.key}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-zinc-300">Genre</label>
                      <Select
                        selectedKeys={filters.genre ? [filters.genre] : []}
                        onSelectionChange={(keys) => handleFilterChange('genre', Array.from(keys)[0] || '')}
                        placeholder="All Genres"
                        className="w-full"
                        radius="lg"
                        variant="bordered"
                      >
                        {(filters.type === 'movie' ? genres.movie :
                          filters.type === 'tv' ? genres.tv :
                          [...genres.movie, ...genres.tv]).map((genre) => (
                          <SelectItem key={genre.id.toString()}>
                            {genre.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-zinc-300">Year</label>
                      <Select
                        selectedKeys={filters.year ? [filters.year] : []}
                        onSelectionChange={(keys) => handleFilterChange('year', Array.from(keys)[0] || '')}
                        placeholder="Any Year"
                        className="w-full"
                        radius="lg"
                        variant="bordered"
                      >
                        {generateYearOptions().slice(0, 50).map((year) => (
                          <SelectItem key={year.key}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3 text-zinc-300">Sort By</label>
                      <Select
                        selectedKeys={[filters.sort_by]}
                        onSelectionChange={(keys) => handleFilterChange('sort_by', Array.from(keys)[0])}
                        className="w-full"
                        radius="lg"
                        variant="bordered"
                      >
                        {sortOptions.map((option) => (
                          <SelectItem key={option.key}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-4 text-zinc-300">
                      Rating: {filters.rating[0]} - {filters.rating[1]} ★
                    </label>
                    <Slider
                      step={0.1}
                      minValue={0}
                      maxValue={10}
                      value={filters.rating}
                      onChange={(value) => handleFilterChange('rating', value)}
                      className="w-full"
                      color="primary"
                      size="md"
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner color="primary" size="lg" />
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
                {results.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <ResultCard item={item} navigate={navigate} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {results.map((item) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <ResultListItem item={item} navigate={navigate} />
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <motion.div
                variants={itemVariants}
                className="flex justify-center"
              >
                <Pagination
                  total={totalPages}
                  page={filters.page}
                  onChange={(page) => handleFilterChange('page', page)}
                  color="primary"
                  showControls
                  radius="lg"
                  classNames={{
                    wrapper: "gap-2",
                    item: "bg-zinc-900 border-zinc-800 hover:bg-zinc-800",
                    cursor: "shadow-lg"
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

const ResultCard = ({ item, navigate }) => {
  const mediaType = item.title ? 'movie' : 'tv';

  return (
    <motion.div
      className="cursor-pointer group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onTap={() => navigate(`/info/${mediaType}/${item.id}`)}
    >
      <div className="relative rounded-2xl overflow-hidden bg-zinc-900 shadow-xl group-hover:shadow-2xl transition-all duration-300">
        <div className="relative overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            alt={item.title || item.name}
            className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
            fallbackSrc="/placeholder-poster.jpg"
            removeWrapper
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 bg-black/60 rounded-full px-2 py-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium">{item.vote_average?.toFixed(1)}</span>
              </div>
              <Button
                isIconOnly
                size="sm"
                color="primary"
                className="rounded-full opacity-90"
              >
                <Play className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-3 px-1">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {item.title || item.name}
        </h3>
        <p className="text-zinc-500 text-xs">
          {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
        </p>
      </div>
    </motion.div>
  );
};

const ResultListItem = ({ item, navigate }) => {
  const mediaType = item.title ? 'movie' : 'tv';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all duration-300 cursor-pointer rounded-2xl shadow-lg"
        isPressable
        onPress={() => navigate(`/info/${mediaType}/${item.id}`)}
      >
        <CardBody className="p-4">
          <div className="flex gap-4">
            <div className="relative overflow-hidden rounded-xl">
              <Image
                src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                alt={item.title || item.name}
                className="w-20 h-28 object-cover flex-shrink-0"
                fallbackSrc="/placeholder-poster.jpg"
                removeWrapper
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold line-clamp-1 hover:text-blue-400 transition-colors">
                  {item.title || item.name}
                </h3>
                <div className="flex items-center gap-1 ml-4 bg-zinc-800 rounded-full px-2 py-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{item.vote_average?.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
                  </span>
                </div>
                <Chip
                  size="sm"
                  variant="bordered"
                  className="text-xs border-zinc-700"
                  color={mediaType === 'movie' ? 'primary' : 'secondary'}
                >
                  {mediaType === 'movie' ? 'Movie' : 'TV Series'}
                </Chip>
              </div>
              <p className="text-zinc-300 text-sm line-clamp-2 leading-relaxed">
                {item.overview}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default Discover;
