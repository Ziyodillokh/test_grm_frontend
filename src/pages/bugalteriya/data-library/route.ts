import Hub from "./hub";
import Barcodes from "./barcodes";
import Countries from "./countries";
import Factories from "./factories";
import Collections from "./collections";
import Models from "./models";
import Sizes from "./sizes";
import Shapes from "./shapes";
import Colors from "./colors";
import Styles from "./styles";
import Page from "./table";

const meta = { isAuth: true, role: new Set(["admin"]) };

const Route = [
  { url: "/data-library", Element: Hub, meta },
  { url: "/data-library/barcodes", Element: Barcodes, meta },
  { url: "/data-library/countries", Element: Countries, meta },
  { url: "/data-library/factories", Element: Factories, meta },
  { url: "/data-library/collections", Element: Collections, meta },
  { url: "/data-library/models", Element: Models, meta },
  { url: "/data-library/sizes", Element: Sizes, meta },
  { url: "/data-library/shapes", Element: Shapes, meta },
  { url: "/data-library/colors", Element: Colors, meta },
  { url: "/data-library/styles", Element: Styles, meta },
  { url: "/data-library/:id", Element: Page, meta },
];

export default Route;
