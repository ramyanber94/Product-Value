// Navbar.tsx – Qwik Component

import type { QRL } from "@builder.io/qwik";
import { component$ } from "@builder.io/qwik";

export interface NavbarProps {
  onLanguageChange: QRL<(lang: string) => Promise<void>>;
  selectedLanguage?: string;
}

export default component$((props: NavbarProps) => {
  const { onLanguageChange, selectedLanguage } = props;
  return (
    <nav class="bg-black text-white p-4 flex justify-between items-center">
      <div class="text-2xl font-bold text-gold-500">vin4u</div>

      <div class="relative group">
        {/* select language */}
        <select
          class="bg-black text-white border border-gold-500 rounded-md p-2"
          onChange$={(event: any) => {
            const selectedLanguage = event.target.value;
            // Handle language change logic here
            onLanguageChange(selectedLanguage);
          }}
          value={selectedLanguage} // Set the value to the selected language
          // selected optio
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
    </nav>
  );
});
