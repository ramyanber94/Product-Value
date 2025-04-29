// Navbar.tsx – Qwik Component

import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <nav class="bg-black text-white p-4 flex justify-between items-center">
      <div class="text-2xl font-bold text-gold-500">vin4u</div>

      <div class="relative group">
        <button class="px-4 py-2 bg-gold-500 text-black rounded-md focus:outline-none">
          Menu
        </button>
        <div class="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <a href="/about" class="block px-4 py-2 hover:bg-gray-200">
            About Us
          </a>
          <a href="/contact" class="block px-4 py-2 hover:bg-gray-200">
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
});
