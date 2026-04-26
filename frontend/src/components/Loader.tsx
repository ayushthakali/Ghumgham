function Loader() {
  return (
    <div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-[4px] rounded bg-gray-300 mb-4 animate-pulse"
        />
      ))}
    </div>
  );
}

export default Loader;
