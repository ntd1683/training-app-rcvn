class ProductStatus {
  static STOPPED = 0;
  static SELLING = 1;
  static OUT_OF_STOCK = 2;

  static getStatusText(status) {
    switch (status) {
      case ProductStatus.STOPPED:
        return 'Ngừng bán';
      case ProductStatus.SELLING:
        return 'Đang bán';
      case ProductStatus.OUT_OF_STOCK:
        return 'Hết hàng';
      default:
        return 'Không xác định';
    }
  }

  static getAllStatuses() {
    return [
      { value: ProductStatus.STOPPED, label: 'Ngừng bán' },
      { value: ProductStatus.SELLING, label: 'Đang bán' },
      { value: ProductStatus.OUT_OF_STOCK, label: 'Hết hàng' },
    ];
  }
}

export default ProductStatus;