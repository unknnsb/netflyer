import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BACKEND_URL } from "../services/Api";
import {
  Image,
  Spinner,
  Select,
  SelectItem,
  Input,
  Button,
  Chip,
  Card,
  CardBody,
  Pagination,
  Slider
} from "@nextui-org/react";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Calendar,
  X,
  SlidersHorizontal
} from "lucide-react";

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
    { key: 'all', label: 'All' },
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

  const getMediaType = (item) => {
    return item.title ? 'movie' : 'tv';
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

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Discover</h1>
            <p className="text-gray-400">
              {totalResults.toLocaleString()} results found
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                isIconOnly
                variant={viewMode === 'grid' ? 'solid' : 'bordered'}
                color="primary"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === 'list' ? 'solid' : 'bordered'}
                color="primary"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="bordered"
              startContent={<SlidersHorizontal className="w-4 h-4" />}
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              Filters
              {getActiveFiltersCount() > 0 && (
                <Chip size="sm" color="primary" className="absolute -top-2 -right-2">
                  {getActiveFiltersCount()}
                </Chip>
              )}
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="mb-8 bg-gray-900 border-gray-800">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Filters</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    startContent={<X className="w-4 h-4" />}
                  >
                    Clear All
                  </Button>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Content Type</label>
                  <Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-800 border-gray-700"
                    }}
                  >
                    {typeOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <Select
                    value={filters.genre}
                    onChange={(e) => handleFilterChange('genre', e.target.value)}
                    placeholder="All Genres"
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-800 border-gray-700"
                    }}
                  >
                    {(filters.type === 'movie' ? genres.movie :
                      filters.type === 'tv' ? genres.tv :
                      [...genres.movie, ...genres.tv]).map((genre) => (
                      <SelectItem key={genre.id} value={genre.id.toString()}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <Select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    placeholder="Any Year"
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-800 border-gray-700"
                    }}
                  >
                    {generateYearOptions().slice(0, 50).map((year) => (
                      <SelectItem key={year.key} value={year.key}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <Select
                    value={filters.sort_by}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="w-full"
                    classNames={{
                      trigger: "bg-gray-800 border-gray-700"
                    }}
                  >
                    {sortOptions.map((option) => (
                      <SelectItem key={option.key} value={option.key}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-4">
                  Rating: {filters.rating[0]} - {filters.rating[1]}
                </label>
                <Slider
                  step={0.1}
                  minValue={0}
                  maxValue={10}
                  value={filters.rating}
                  onChange={(value) => handleFilterChange('rating', value)}
                  className="w-full"
                  classNames={{
                    track: "bg-gray-700",
                    filler: "bg-primary"
                  }}
                />
              </div>
            </CardBody>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner color="primary" size="xl" />
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8">
                {results.map((item) => (
                  <ResultCard key={item.id} item={item} navigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {results.map((item) => (
                  <ResultListItem key={item.id} item={item} navigate={navigate} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  total={totalPages}
                  page={filters.page}
                  onChange={(page) => handleFilterChange('page', page)}
                  color="primary"
                  showControls
                  classNames={{
                    wrapper: "gap-2",
                    item: "bg-gray-800 border-gray-700"
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ResultCard = ({ item, navigate }) => {
  const mediaType = item.title ? 'movie' : 'tv';

  return (
    <div
      className="cursor-pointer transition-transform duration-300 hover:scale-105 group"
      onClick={() => navigate(`/info/${mediaType}/${item.id}`)}
    >
      <div className="relative rounded-lg overflow-hidden bg-gray-800 shadow-lg">
        <Image
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={item.title || item.name}
          className="w-full h-80 object-cover"
          fallbackSrc="/placeholder-poster.jpg"
          removeWrapper
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm">{item.vote_average?.toFixed(1)}</span>
          </div>
          <h3 className="text-white font-semibold text-sm line-clamp-2">
            {item.title || item.name}
          </h3>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {item.title || item.name}
        </h3>
        <p className="text-gray-400 text-xs">
          {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
        </p>
      </div>
    </div>
  );
};

const ResultListItem = ({ item, navigate }) => {
  const mediaType = item.title ? 'movie' : 'tv';

  return (
    <Card
      className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors cursor-pointer"
      onClick={() => navigate(`/info/${mediaType}/${item.id}`)}
    >
      <CardBody className="p-4">
        <div className="flex gap-4">
          <Image
            src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
            alt={item.title || item.name}
            className="w-20 h-28 object-cover rounded-lg flex-shrink-0"
            fallbackSrc="/placeholder-poster.jpg"
            removeWrapper
          />

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold line-clamp-1">
                {item.title || item.name}
              </h3>
              <div className="flex items-center gap-1 ml-4">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{item.vote_average?.toFixed(1)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0]}
                </span>
              </div>
              <Chip size="sm" variant="bordered" className="text-xs">
                {mediaType === 'movie' ? 'Movie' : 'TV Series'}
              </Chip>
            </div>

            <p className="text-gray-300 text-sm line-clamp-2">
              {item.overview}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Discover;
