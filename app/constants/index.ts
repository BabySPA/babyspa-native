export enum CustomerStatus {
  Completed = 0, // 已完成
  Canceled, // 已取消
  ToBeCollected, // 待收集
  ToBeAnalyzed, // 待分析
  ToBeConfirmed, // 待确认
}
export enum Gender {
  WOMAN = 0,
  MAN = 1,
}

export const DOCTOR_ROLE_ID = '6Zeo5bqX6LCD55CG5biI';

export const StatusTextConfig = {
  [CustomerStatus.ToBeConfirmed]: {
    text: '待确认',
    textColor: '#FB6459',
    bgColor: 'rgba(251, 100, 89, 0.2)',
  },
  [CustomerStatus.ToBeCollected]: {
    text: '待采集',
    textColor: '#FE9505',
    bgColor: 'rgba(254, 149, 5, 0.2)',
  },
  [CustomerStatus.ToBeAnalyzed]: {
    text: '待分析',
    textColor: '#2AA1F7',
    bgColor: 'rgba(42, 161, 247, 0.2)',
  },
  [CustomerStatus.Completed]: {
    text: '已完成',
    textColor: '#00B49E',
    bgColor: 'rgba(0, 180, 158, 0.2)',
  },
  [CustomerStatus.Canceled]: {
    text: '已取消',
    textColor: '#777',
    bgColor: 'rgba(119, 119, 119, 0.2)',
  },
};
