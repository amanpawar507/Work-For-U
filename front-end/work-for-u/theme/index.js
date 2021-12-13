import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const overrides = {
  fonts: {
    heading: "Roboto",
    body: "Roboto",
  },
  colors: {
    brand: {
      100: "#FDFCFC",
      300: "#F6EABE",
      500: "#87AAAA",
      700: "#C8E3D4",
      900: "#F6D7A7",
    },
  },
  components: {
    Select: {
      parts: [],
      // The base styles for each part
      baseStyle: {},
      // The size styles for each part
      sizes: {},
      // The variant styles for each part
      variants: {},
      // The default `size` or `variant` values
      defaultProps: {
        size: "lg",
        focusBorderColor: "brand.900",
      },
    },
  },
};

export default extendTheme(
  overrides,
  withDefaultColorScheme({ colorScheme: "brand" })
);
