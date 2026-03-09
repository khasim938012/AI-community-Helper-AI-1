import { Mic } from 'lucide-react';

const Topbar = () => {
  return (
    <div className="h-20 bg-[#0F0C29] flex items-center justify-between px-8 border-b border-gray-800 shadow-md z-10">
      <div className="flex items-center space-x-3">
        <span className="text-pink-500 text-2xl">✦</span>
        <h2 className="text-xl font-extrabold tracking-widest text-white uppercase">State Portal</h2>
      </div>

      <div className="flex items-center space-x-6">
        <button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 p-3 rounded-full text-white shadow-lg transition-transform transform active:scale-95">
          <Mic size={20} />
        </button>
        
        <div className="relative">
          <select className="appearance-none bg-[#161329] border border-gray-700 text-white rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-pink-500 cursor-pointer text-sm font-medium">
            <option>English (IN)</option>
            <option>Hindi</option>
            <option>Kannada</option>
            <option>Telugu</option>
            <option>Marathi</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
