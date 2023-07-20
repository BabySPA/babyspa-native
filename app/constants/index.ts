import { CustomerStatus } from '../types';

type StatusOperateConfig = {
  [key in CustomerStatus]: {
    operate?: string;
  };
};

export const StatusOperateConfig: StatusOperateConfig = {
  [CustomerStatus.ToBeCollected]: {
    operate: '采集',
  },
  [CustomerStatus.ToBeAnalyzed]: {
    operate: '分析',
  },
  [CustomerStatus.Completed]: {},
  [CustomerStatus.Canceled]: {},
  [CustomerStatus.ToBeConfirmed]: {},
};

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

export const FlowOperatorConfig = [
  {
    text: '健康资料',
    key: 'healthInfo',
  },
  {
    text: '调理导向',
    key: 'guidance',
  },
  {
    text: '分析结论',
    key: 'conclusions',
  },
  {
    text: '调理方案',
    key: 'solution',
  },
  {
    text: '反馈',
    key: 'evaluation',
  },
];
