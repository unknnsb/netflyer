import React from "react";

const Row = ({ items, title }) => {
  const rowRef = React.useRef(null);

  return (
    <div className="my-8">
      {title && (
        <h2 className="text-2xl font-semibold text-white mb-4 ml-2">{title}</h2>
      )}
      <div className="flex items-center overflow-x-auto relative" ref={rowRef}>
        {items.map((item, index) => (
          <RowCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

function RowCard({ item }) {
  const onClick = async () => {
    const path = item.first_air_date
      ? `/info/tv/${item.id}`
      : `/info/movie/${item.id}`;
    window.location.href = path;
  };

  return (
    <div className="flex-shrink-0 mx-2 cursor-pointer">
      <img
        src={`https://image.tmdb.org/t/p/w185/${item.profile_path}`}
        alt={item.name || item.title}
        className="w-40 h-60 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300 ease-in-out"
        onClick={onClick}
      />
    </div>
  );
}

export default Row;
