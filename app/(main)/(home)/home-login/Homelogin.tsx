export default function HomeLogin() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
      <p className="text-gray-600 mb-8">Here is the latest from your feed.</p>
      
      <div className="grid gap-6">
        {/* Placeholder for blog posts */}
        <div className="p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold">Your First Post</h2>
          <p className="text-gray-500 mt-2">This is only visible to logged-in users...</p>
        </div>
      </div>
    </div>
  );
}
