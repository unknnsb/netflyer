import { Button, Image, Spinner } from "@nextui-org/react";
import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Row = ({ items, title }) => {
  const [loading, setLoading] = React.useState(true);

  const isMobile = window.innerWidth <= 768;

  const Items = items.map((item, index) => ({
    id: `anime-${index}`,
    item: item,
  }));

  React.useEffect(() => {
    if (items.length > 5) {
      setLoading(false);
    }
  }, [items]);

  return (
    <div>
      {title && (
        <h2 className="text-2xl font-semibold text-white ml-3 mb-4">{title}</h2>
      )}
      {loading ? (
        <div className="w-full h-10 flex items-center justify-start mb-4 ml-3">
          <Spinner size="lg" color="default" />
        </div>
      ) : (
        <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
          {Items.map(({ id, item }) => (
            <RowCard
              key={id}
              item={item}
              isMobile={isMobile}
            />
          ))}
        </ScrollMenu>
      )}
    </div>
  );
};

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <Button
      disabled={isFirstItemVisible}
      onClick={() => scrollPrev()}
      color="default"
      className={`mr-2 h-full left-arrow ${
        isFirstItemVisible ? "hidden" : "text-black"
      }`}
      isIconOnly
    >
      <IoIosArrowBack className="w-6 h-6" />
    </Button>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <Button
      disabled={isLastItemVisible}
      color="default"
      onClick={() => scrollNext()}
      className={`h-full ml-2 right-arrow ${
        isLastItemVisible ? "hidden" : "text-black"
      }`}
      isIconOnly
    >
      <IoIosArrowForward className="w-6 h-6" />
    </Button>
  );
}

function RowCard({ item, isMobile }) {
  const onClick = async () => {
    if (item.first_air_date) {
    window.location.href = `/info/tv/${item.id}`
    } else {
      window.location.href = `/info/movie/${item.id}`
    }
  };

  return (
    <div
      onClick={() => {
        onClick();
      }}
      className="w-64 md:w-40 ml-3"
    >
      <div
        className={`relative group ${
          isMobile
            ? "cursor-pointer"
            : "hover:transform hover:scale-105 transition-transform duration-300 ease-in-out"
        }`}
      >
        <div className="bg-black rounded-lg overflow-hidden shadow-md hover:shadow-lg">
          <Image
            src={`https://image.tmdb.org/t/p/original/${item.poster_path}`}
            alt={item.name || item.title}
            className="w-64 h-96 md:w-40 md:h-60 object-cover"
            fallbackSrc="/not-found.png"
          />
          {!isMobile && (
            <div
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
            >
              <h3 className="text-2xl font-semibold text-center text-white">
                {item.name || item.title}
              </h3>
              <Button
                onClick={() => onClick()}
                className="bg-blue text-white rounded-full px-4 py-2 transition-all duration-300"
                color="danger"
                variant="flat"
              >
                Watch Now
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Row;
