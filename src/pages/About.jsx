import Header from "../components/Navbar";
import { Button, Image, Card, CardBody } from "@heroui/react";
import { Github, Mail, Heart, Code } from "lucide-react";
import { BACKEND_URL } from "../services/Api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const About = () => {
  const [developerPicks, setDeveloperPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeveloperPicks = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/developer_picks`);
        const data = await response.json();
        setDeveloperPicks(data.picks);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching developer picks:", error);
        setLoading(false);
      }
    };
    fetchDeveloperPicks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const picksVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-6 py-12 max-w-6xl"
        >
          {/* Hero Section */}
          <motion.section variants={itemVariants} className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              About Netflyer
            </h1>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Netflyer is a modern streaming platform that brings your favorite movies and TV shows directly to your browser with a seamless, ad-free experience.
            </p>
          </motion.section>

          {/* About Me Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-6">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-6">About the Developer</h2>
                <div className="max-w-2xl mx-auto space-y-4">
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    Hey there! I'm <span className="text-blue-400 font-semibold">Nesbeer</span>, and I built this streaming platform with passion and dedication. Currently, Netflyer is completely ad-free to provide you with the best viewing experience.
                  </p>
                  <p className="text-lg text-zinc-300 leading-relaxed">
                    I'm committed to regular updates and improvements to make your streaming experience even better. Future developments may include thoughtful monetization to support continued growth.
                  </p>
                </div>
              </CardBody>
            </Card>
          </motion.section>

          {/* Developer Picks Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Developer Picks</h2>
              <p className="text-lg text-zinc-400">
                Handpicked recommendations from my personal collection of favorites
              </p>
            </div>

            <motion.div
              variants={picksVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {developerPicks.map((pick, index) => (
                <motion.div
                  key={pick.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    window.location.href = `/info/${pick.media_type}/${pick.id}`;
                  }}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <Image
                      src={`https://image.tmdb.org/t/p/w300${pick.poster_path}`}
                      alt={pick.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-300"
                      radius="lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Contact Section */}
          <motion.section variants={itemVariants}>
            <Card className="bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-xl">
              <CardBody className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
                  Have questions, feedback, or suggestions? I'd love to hear from you! Reach out through any of these platforms.
                </p>

                <div className="flex flex-wrap gap-4 justify-center">
                  <Button
                    startContent={<Github className="w-5 h-5" />}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg shadow-lg"
                    size="lg"
                    onPress={() => {
                      window.open("https://github.com/unknnsb", "_blank");
                    }}
                  >
                    GitHub
                  </Button>
                  <Button
                    startContent={<Mail className="w-5 h-5" />}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg"
                    size="lg"
                    onPress={() => {
                      window.location.href = "mailto:asnesbeer3@gmail.com";
                    }}
                  >
                    Email
                  </Button>
                </div>
              </CardBody>
            </Card>
          </motion.section>
        </motion.div>
      )}
    </div>
  );
};

export default About;
