import React, { useRef } from "react";
import { motion } from "framer-motion";

const Row = ({ items, title }) => {
  const rowRef = useRef(null);

  return (
    <div className="my-8">
      {title && (
        <h2 className="text-2xl font-semibold text-white mb-4 ml-2">{title}</h2>
      )}
      <div
        ref={rowRef}
        className="flex items-center overflow-x-auto no-scrollbar space-x-4 px-2"
      >
        {items.map((item, index) => (
          <RowCard key={item.id || index} item={item} />
        ))}
      </div>
    </div>
  );
};

function RowCard({ item }) {
  const onClick = () => {
    const path = item.first_air_date ? `/info/tv/${item.id}` : `/info/movie/${item.id}`;
    window.location.href = path;
  };

  return (
    <motion.div
      className="flex-shrink-0 cursor-pointer rounded-lg shadow-md"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.name || item.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/w185/${item.poster_path}`}
        alt={item.name || item.title}
        className="w-40 h-60 object-cover rounded-lg"
        loading="lazy"
      />
    </motion.div>
  );
}

export default Row;
