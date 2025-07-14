class RoleMain {
  static Reviewer = 0;
  static Editor = 1;
  static Admin = 2;
  static SuperAdmin = 3;
  static defaultRole = 1;

  static getRoleText(role) {
    switch (role) {
      case RoleMain.Reviewer:
        return 'Người đánh giá';
      case RoleMain.Editor:
        return 'Biên tập viên';
      case RoleMain.Admin:
        return 'Quản trị viên';
      case RoleMain.SuperAdmin:
        return 'Siêu quản trị viên';
      default:
        return 'Không xác định';
    }
  }

  static getAllStatuses() {
    return [
      { value: RoleMain.Reviewer, label: 'Người đánh giá' },
      { value: RoleMain.Editor, label: 'Biên tập viên' },
      { value: RoleMain.Admin, label: 'Quản trị viên' },
      { value: RoleMain.SuperAdmin, label: 'Siêu quản trị viên' },
    ];
  }

  static getValue(roleText) {
    switch (roleText) {
      case 'Reviewer':
        return RoleMain.Reviewer;
      case 'Editor':
        return RoleMain.Editor;
      case 'Admin':
        return RoleMain.Admin;
      case 'SuperAdmin':
        return RoleMain.SuperAdmin;
      default:
        return RoleMain.defaultRole;
    }
  }
}

export default RoleMain;