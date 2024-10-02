/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'sans-serif']
			},
			colors: {
				primary: {
					DEFAULT: '#3B82F6',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#1F2937',
					foreground: '#F9FAFB'
				}
			}
		}
	},
	plugins: []
};
