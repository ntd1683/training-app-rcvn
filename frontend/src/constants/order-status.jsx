class OrderStatus {
  static PENDING = 0;
  static PROCESSING = 1;
  static COMPLETED = 2;
  static PAYMENT_FAILED = 3;

  static getStatusText(status) {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Chờ xử lý';
      case OrderStatus.PROCESSING:
        return 'Đang xử lý';
      case OrderStatus.COMPLETED:
        return 'Đã hoàn thành';
      case OrderStatus.PAYMENT_FAILED:
        return 'Thanh toán thất bại';
      default:
        return 'Đang xử lý';
    }
  }

  static getAllStatuses() {
    return [
      { value: OrderStatus.PENDING, label: 'Chờ xử lý' },
      { value: OrderStatus.PROCESSING, label: 'Đang xử lý' },
      { value: OrderStatus.COMPLETED, label: 'Đã hoàn thành' },
      { value: OrderStatus.PAYMENT_FAILED, label: 'Thanh toán thất bại' }
    ];
  }
}

export default OrderStatus;