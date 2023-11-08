import * as Http_Errors from "../errors/http_errors";

export function assertIsPriceRange(val: string): asserts val is PriceRange {
  if (val !== "$" && val !== "$$" && val !== "$$$")
    throw new Http_Errors.InvalidField("price range");
}
