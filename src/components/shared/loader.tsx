import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <div class="flex items-center justify-center h-screen">
      <svg
        class="animate-spin h-10 w-10 text-gray-200"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4.93 4.93a10 10 0 0 1 14.14 14.14L12 12l-7.07-7.07z"
        ></path>
      </svg>
    </div>
  );
});
