function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-secondary-500 mb-4">Tailwind Card</h2>
        <p className="text-gray-600 mb-6">
          This is a simple card layout built with Tailwind CSS.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
          Learn More
        </button>
      </div>
    </div>
  );
}

export default App;