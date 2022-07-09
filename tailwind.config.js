module.exports = {
  content: ["./src/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  // daisyui: {
  //   themes: [
  //     {
  //       vla: {
  //         primary: "rgb(230, 226, 255)",

  //         secondary: "rgb(229, 181, 169)",

  //         accent: "rgb(158, 173, 234)",

  //         neutral: "rgb(123, 159, 205)",

  //         "base-100": "#FCFCFC",

  //         info: "rgb(179, 243, 255)",

  //         success: "rgb(125, 235, 254)",

  //         warning: "rgb(255, 242, 225)",

  //         error: "rgb(195, 255, 193)",
  //       },
  //     },
  //   ],
  // },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};
