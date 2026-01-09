const Loader = ({ value = false }) => {
  return (
    <>
      {value && (
        <div className="w-screen fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/40">
          <div className="h-16 w-16 border-8 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default Loader;
