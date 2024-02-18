import dayjs from 'dayjs';
import {
  AnalyzeStatus,
  CollectStatus,
  EvaluateStatus,
  FlowItemResponse,
  FollowUpResult,
  FollowUpStatus,
  RegisterStatus,
} from '../stores/flow/type';

export const generateFlowCounts = (
  flows: FlowItemResponse[],
): {
  register: number;
  collect: number;
  analyze: number;
  analyzeError: number;
  massage: number;
  application: number;
} => {
  let register = 0;
  let collect = 0;
  let analyze = 0;
  let analyzeError = 0;
  let massage = 0;
  let application = 0;
  for (let index = 0; index < flows.length; index++) {
    const flow = flows[index];
    if (flow.register.status === RegisterStatus.DONE) {
      register++;
    }
    if (flow.collect.status === CollectStatus.DONE) {
      collect++;
    }
    if (flow.analyze.status === AnalyzeStatus.DONE) {
      analyze++;
    }
    const massageCount = flow.analyze.solution.massages.reduce(
      (sum: number, item: { count: number }) => {
        return sum + item.count;
      },
      0,
    );
    massage += massageCount;
    const applicationsCount = flow.analyze.solution.applications.reduce(
      (sum: number, item: { count: number }) => {
        return sum + item.count;
      },
      0,
    );
    application += applicationsCount;

    if (
      flow.evaluate.status == EvaluateStatus.DONE &&
      (flow.evaluate.score ?? 0) <= 2
    ) {
      analyzeError++;
    }
  }

  return {
    register,
    collect,
    analyzeError,
    analyze,
    massage,
    application,
  };
};

export const generateFollowUpFlows = (
  flows: FlowItemResponse[],
): {
  flows: FlowItemResponse[];
  counts: {
    all: number;
    done: number;
    overdue: number;
    cancel: number;
    well: number;
    bad: number;
    worse: number;
  };
} => {
  const tempFollowUpFlows = [];
  const counts = {
    all: 0,
    done: 0,
    overdue: 0,
    cancel: 0,
    well: 0,
    bad: 0,
    worse: 0,
  };
  for (let index = 0; index < flows.length; index++) {
    const flow = flows[index];
    if (flow.analyze.followUp.followUpStatus === FollowUpStatus.NOT_SET) {
      continue;
    }

    if (flow.analyze.followUp.followUpStatus === FollowUpStatus.WAIT) {
      // 待随访
      if (dayjs().isAfter(dayjs(flow.analyze.followUp.followUpTime), 'day')) {
        // 已经过了随访时间
        counts.overdue++;
        flow.analyze.followUp.followUpStatus = FollowUpStatus.OVERDUE;
      }

      tempFollowUpFlows.push(flow);
    } else if (flow.analyze.followUp.followUpStatus === FollowUpStatus.CANCEL) {
      counts.cancel++;
      tempFollowUpFlows.push(flow);
    } else if (flow.analyze.followUp.followUpStatus === FollowUpStatus.DONE) {
      counts.done++;
      tempFollowUpFlows.push(flow);

      if (flow.analyze.followUp.followUpResult === FollowUpResult.GOOD) {
        counts.well++;
      } else if (flow.analyze.followUp.followUpResult === FollowUpResult.BAD) {
        counts.bad++;
      } else {
        counts.worse++;
      }
    }
  }
  counts.all = tempFollowUpFlows.length;

  return {
    flows: tempFollowUpFlows,
    counts,
  };
};
