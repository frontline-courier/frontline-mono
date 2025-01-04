import 'package:intl/intl.dart';

bool isDelivered(List<dynamic> deliveries) {
  if (deliveries == null || deliveries.length == 0) {
    return false;
  }

  if (deliveries
          .where(((e) => e['statusId'].toString() == 'Delivered'))
          .length >
      0) {
    return true;
  }

  return false;
}

String getDeliveryDate(List<dynamic> deliveries) {
  if (deliveries == null || deliveries.length == 0) {
    return '';
  }

  var deliveryStatus =
      deliveries.firstWhere(((e) => e['statusId'].toString() == 'Delivered'));

  if (deliveryStatus.length == 0) {
    return '';
  }

  return DateFormat('MMM d, y hh:mm a').format(
      DateFormat("yyyy-MM-dd'T'HH:mm").parse(deliveryStatus['statusDate']));
}
