export function getInsuranceRate(isUsedProduct: boolean) {
  return isUsedProduct ? 0.03 : 0.025;
}

export function calculateInsuranceAmount(goodsValue: unknown, isUsedProduct: boolean) {
  const numericGoodsValue = Number(goodsValue);

  if (!Number.isFinite(numericGoodsValue) || numericGoodsValue <= 0) {
    return 0;
  }

  return Number((numericGoodsValue * getInsuranceRate(isUsedProduct)).toFixed(2));
}
