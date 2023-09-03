import {
  AnalyzeStatus,
  CollectStatus,
  FlowItemResponse,
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
