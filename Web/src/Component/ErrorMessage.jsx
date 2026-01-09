function ErrorMessage({ message = "Hello Man" }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg text-sm">
      {message}
    </div>
  );
}

export default ErrorMessage;

