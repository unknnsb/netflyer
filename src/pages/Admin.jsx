"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../services/Firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import {
  BadgePercent,
  List,
  User,
  Star,
  Eye,
  Trash2,
  Edit3,
  Search,
  Film,
  Tv,
  MessageSquare,
  Heart,
  Calendar,
  TrendingUp,
  Settings,
  LogOut,
  Shield,
  Database,
  Activity,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Image
} from "@heroui/react";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u && u.email === ADMIN_EMAIL);
      if (u && u.email === ADMIN_EMAIL) {
        fetchData();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      setLoginError(error.message);
    }
    setLoggingIn(false);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  async function fetchData() {
    setLoading(true);
    try {
      const usersSnap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
      setUsers(usersSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));

      const reviewsSnap = await getDocs(query(collection(db, "reviews"), orderBy("createdAt", "desc")));
      setReviews(reviewsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));

      const watchlistSnap = await getDocs(query(collection(db, "watchlist"), orderBy("addedAt", "desc")));
      setWatchlists(watchlistSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }

  const handleDelete = async (type, id) => {
    try {
      await deleteDoc(doc(db, type, id));
      await fetchData();
      onDeleteClose();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleEdit = async (type, id, data) => {
    try {
      if (type === 'reviews') {
        data.updatedAt = new Date();
      }
      await updateDoc(doc(db, type, id), data);
      await fetchData();
      onEditClose();
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const getStats = () => {
    const totalUsers = users.length;
    const totalReviews = reviews.length;
    const totalWatchlistItems = watchlists.length;
    const activeUsers = users.filter(u => u.lastActive &&
      new Date(u.lastActive.toDate()) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    return { totalUsers, totalReviews, totalWatchlistItems, activeUsers };
  };

  const filteredData = (data, type) => {
    if (!searchQuery) return data;
    return data.filter(item => {
      switch (type) {
        case 'users':
          return item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchQuery.toLowerCase());
        case 'reviews':
          return item.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.itemId?.toLowerCase().includes(searchQuery.toLowerCase());
        case 'watchlists':
          return item.userID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.title?.toLowerCase().includes(searchQuery.toLowerCase());
        default:
          return true;
      }
    });
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <span className="text-lg text-white">Loading dashboard...</span>
      </div>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-col items-center text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Netflyer Admin</h1>
            <p className="text-zinc-400">Secure admin portal</p>
          </CardHeader>
          <CardBody className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                type="email"
                label="Email"
                variant="bordered"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="text-white"
                radius="lg"
                required
              />
              <Input
                type="password"
                label="Password"
                variant="bordered"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="text-white"
                radius="lg"
                required
              />
              {loginError && (
                <p className="text-red-400 text-sm">{loginError}</p>
              )}
              <Button
                type="submit"
                color="primary"
                className="w-full rounded-lg font-semibold"
                isLoading={loggingIn}
                size="lg"
              >
                Sign In
              </Button>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );

  if (!isAdmin) return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <span className="text-lg text-red-400">Access Denied</span>
        <p className="text-zinc-500 mt-2">You don't have permission to access this area</p>
      </div>
    </div>
  );

  const stats = getStats();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-zinc-400 text-sm">Welcome back, {user.email}</p>
            </div>
          </div>
          <Button
            variant="bordered"
            startContent={<LogOut className="w-4 h-4" />}
            onPress={handleLogout}
            className="rounded-lg"
          >
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <User className="w-8 h-8 text-blue-400" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Total Reviews</p>
                  <p className="text-2xl font-bold">{stats.totalReviews}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-400" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Watchlist Items</p>
                  <p className="text-2xl font-bold">{stats.totalWatchlistItems}</p>
                </div>
                <Heart className="w-8 h-8 text-red-400" />
              </div>
            </CardBody>
          </Card>

          <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
          <CardBody className="p-6">
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={setActiveTab}
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-primary"
              }}
            >
              <Tab
                key="users"
                title={
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Users</span>
                    <Chip size="sm" variant="flat">{users.length}</Chip>
                  </div>
                }
              >
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">User Management</h3>
                    <Input
                      placeholder="Search users..."
                      startContent={<Search className="w-4 h-4" />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-xs"
                      variant="bordered"
                      radius="lg"
                    />
                  </div>

                  <Table aria-label="Users table" className="min-h-[400px]">
                    <TableHeader>
                      <TableColumn>USER</TableColumn>
                      <TableColumn>EMAIL</TableColumn>
                      <TableColumn>JOINED</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {filteredData(users, 'users').slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={user.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase()}
                                size="sm"
                                className="bg-blue-500"
                              />
                              <span className="font-medium">{user.username || 'No username'}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email || 'No email'}</TableCell>
                          <TableCell>
                            {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => {
                                  setSelectedItem({ ...user, type: 'user' });
                                  onDetailOpen();
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => {
                                  setEditItem({ ...user, type: 'users' });
                                  onEditOpen();
                                }}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() => {
                                  setSelectedItem({ ...user, type: 'users' });
                                  onDeleteOpen();
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Tab>

              <Tab
                key="reviews"
                title={
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Reviews</span>
                    <Chip size="sm" variant="flat">{reviews.length}</Chip>
                  </div>
                }
              >
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Review Management</h3>
                    <Input
                      placeholder="Search reviews..."
                      startContent={<Search className="w-4 h-4" />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-xs"
                      variant="bordered"
                      radius="lg"
                    />
                  </div>

                  <div className="space-y-4">
                    {filteredData(reviews, 'reviews').slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((review) => (
                      <Card key={review.id} className="bg-zinc-800/50 border border-zinc-700">
                        <CardBody className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Avatar
                                  name={review.userName?.charAt(0)?.toUpperCase()}
                                  size="sm"
                                />
                                <span className="font-semibold">{review.userName}</span>
                                <Chip size="sm" variant="flat" color={review.type === 'movie' ? 'primary' : 'secondary'}>
                                  {review.type}
                                </Chip>
                                <span className="text-zinc-500 text-sm">
                                  ID: {review.itemId}
                                </span>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  onPress={() => window.open(`/info/${review.type}/${review.itemId}`, '_blank')}
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-zinc-300 mb-2 line-clamp-2">{review.text}</p>
                              <div className="flex items-center gap-4 text-sm text-zinc-500">
                                <span className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  {review.likeCount || 0} likes
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {review.createdAt ? new Date(review.createdAt.toDate()).toLocaleDateString() : 'No date'}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => {
                                  setSelectedItem({ ...review, type: 'review' });
                                  onDetailOpen();
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => {
                                  setEditItem({ ...review, type: 'reviews' });
                                  onEditOpen();
                                }}
                              >
                                <Edit3 className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color="danger"
                                onPress={() => {
                                  setSelectedItem({ ...review, type: 'reviews' });
                                  onDeleteOpen();
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>

              <Tab
                key="watchlists"
                title={
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>Watchlists</span>
                    <Chip size="sm" variant="flat">{watchlists.length}</Chip>
                  </div>
                }
              >
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Watchlist Management</h3>
                    <Input
                      placeholder="Search watchlists..."
                      startContent={<Search className="w-4 h-4" />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-xs"
                      variant="bordered"
                      radius="lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredData(watchlists, 'watchlists').slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
                      <Card key={item.id} className="bg-zinc-800/50 border border-zinc-700 hover:bg-zinc-700/50 transition-all duration-300">
                        <CardBody className="p-4">
                          <div className="flex gap-4">
                            <Image
                              src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
                              alt={item.title}
                              className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                              fallbackSrc="/placeholder-poster.jpg"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                {item.type === 'movie' ?
                                  <Film className="w-4 h-4 text-blue-400" /> :
                                  <Tv className="w-4 h-4 text-purple-400" />
                                }
                                <Chip size="sm" variant="flat" color={item.type === 'movie' ? 'primary' : 'secondary'}>
                                  {item.type}
                                </Chip>
                              </div>
                              <h4 className="font-semibold text-sm line-clamp-2 mb-2">{item.title}</h4>
                              <p className="text-xs text-zinc-500 mb-2">User: {item.userID}</p>
                              <p className="text-xs text-zinc-500 mb-3">
                                Added: {item.addedAt ? new Date(item.addedAt.toDate()).toLocaleDateString() : 'Unknown'}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="light"
                                  startContent={<ExternalLink className="w-3 h-3" />}
                                  onPress={() => window.open(`/info/${item.type}/${item.id}`, '_blank')}
                                  className="flex-1"
                                >
                                  View
                                </Button>
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  onPress={() => {
                                    setSelectedItem({ ...item, type: 'watchlist' });
                                    onDeleteOpen();
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </Tab>
            </Tabs>

            <div className="flex justify-center mt-8">
              <Pagination
                total={Math.ceil(filteredData(
                  activeTab === 'users' ? users :
                    activeTab === 'reviews' ? reviews : watchlists,
                  activeTab
                ).length / itemsPerPage)}
                page={currentPage}
                onChange={setCurrentPage}
                color="primary"
                showControls
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="2xl">
        <ModalContent className="bg-zinc-900 border border-zinc-800 text-white">
          <ModalHeader>
            <h3 className="text-xl font-semibold">
              {selectedItem?.type === 'user' ? 'User Details' :
                selectedItem?.type === 'review' ? 'Review Details' : 'Watchlist Item Details'}
            </h3>
          </ModalHeader>
          <ModalBody>
            {selectedItem && (
              <div className="space-y-4">
                {Object.entries(selectedItem).filter(([key]) => key !== 'type').map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-zinc-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="p-3 bg-zinc-800 rounded-lg text-sm">
                      {key === 'posterPath' && value ? (
                        <div className="flex items-center gap-3">
                          <Image
                            src={`https://image.tmdb.org/t/p/w92${value}`}
                            alt="Poster"
                            className="w-12 h-18 object-cover rounded"
                          />
                          <code className="text-blue-400">{value}</code>
                        </div>
                      ) : typeof value === 'object' && value?.toDate ?
                        new Date(value.toDate()).toLocaleString() :
                        Array.isArray(value) ? value.join(', ') :
                          String(value)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDetailClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">
        <ModalContent className="bg-zinc-900 border border-zinc-800 text-white">
          <ModalHeader>Edit Item</ModalHeader>
          <ModalBody>
            {editItem && (
              <div className="space-y-4">
                {editItem.type === 'users' && (
                  <>
                    <Input
                      label="Username"
                      variant="bordered"
                      value={editItem.username || ''}
                      onChange={(e) => setEditItem({ ...editItem, username: e.target.value })}
                    />
                    <Input
                      label="Email"
                      variant="bordered"
                      value={editItem.email || ''}
                      onChange={(e) => setEditItem({ ...editItem, email: e.target.value })}
                    />
                  </>
                )}
                {editItem.type === 'reviews' && (
                  <>
                    <Input
                      label="User Name"
                      variant="bordered"
                      value={editItem.userName || ''}
                      onChange={(e) => setEditItem({ ...editItem, userName: e.target.value })}
                    />
                    <Textarea
                      label="Review Text"
                      variant="bordered"
                      value={editItem.text || ''}
                      onChange={(e) => setEditItem({ ...editItem, text: e.target.value })}
                    />
                    <Input
                      label="Like Count"
                      type="number"
                      variant="bordered"
                      value={editItem.likeCount || 0}
                      onChange={(e) => setEditItem({ ...editItem, likeCount: parseInt(e.target.value) || 0 })}
                    />
                  </>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={() => {
                const { type, id, ...data } = editItem;
                handleEdit(type, id, data);
              }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent className="bg-zinc-900 border border-zinc-800 text-white">
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteClose}>
              Cancel
            </Button>
            <Button
              color="danger"
              onPress={() => handleDelete(selectedItem?.type, selectedItem?.id)}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

