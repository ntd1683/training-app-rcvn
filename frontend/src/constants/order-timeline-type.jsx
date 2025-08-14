class OrderTimelineType {
  static PENDING = 0;
    static PROCESSING = 1;
    static COMPLETED = 2;
    static PAID = 3;
    static FAILED = 4;

  static getStatusText(status) {
    switch (status) {
      case OrderTimelineType.PENDING:
        return 'Chờ xử lý';
      case OrderTimelineType.PROCESSING:
        return 'Đang xử lý';
      case OrderTimelineType.COMPLETED:
        return 'Đã hoàn thành';
      case OrderTimelineType.PAID:
        return 'Thanh toán thành công';
      case OrderTimelineType.FAILED:
        return 'Thanh toán thất bại';
      default:
        return 'Đang xử lý';
    }
  }

  static getAllStatuses() {
    return [
      { value: OrderTimelineType.PENDING, label: 'Chờ xử lý' },
      { value: OrderTimelineType.PROCESSING, label: 'Đang xử lý' },
      { value: OrderTimelineType.COMPLETED, label: 'Đã hoàn thành' },
      { value: OrderTimelineType.PAID, label: 'Thanh toán thành công' },
      { value: OrderTimelineType.FAILED, label: 'Thanh toán thất bại' }
    ];
  }
}

export default OrderTimelineType;