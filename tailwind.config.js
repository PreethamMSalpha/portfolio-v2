/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Geist Sans', 'Inter', 'system-ui', 'sans-serif'],
				mono: ['Geist Mono', 'monospace']
			},
			colors: {
				'yulu-blue': '#00DCF6',
				dark: {
					DEFAULT: '#0A0A0A',
					lighter: '#121212'
				}
			}
		}
	},
	plugins: []
};
