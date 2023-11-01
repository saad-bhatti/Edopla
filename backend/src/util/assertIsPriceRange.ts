import createHttpError from "http-errors";

export function assertIsPriceRange(val: string): asserts val is PriceRange {
  if (val !== "$" && val !== "$$" && val !== "$$$")
    throw createHttpError(400, "Received an invalid price range");
}
