function formatPrice(price: number) {
  return new Intl.NumberFormat()
    .format(price ?? 0)
    .split(",")
    .join(" ");
}

export default formatPrice;
