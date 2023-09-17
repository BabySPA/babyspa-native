import { Pressable, Text, Row } from 'native-base';
import { ss, ls, sp } from '../utils/style';
import * as Print from 'expo-print';
import useFlowStore from '../stores/flow';
import { getAge } from '../utils';
import dayjs from 'dayjs';

export function PrintButton() {
  const { currentFlow } = useFlowStore();
  const age = getAge(currentFlow.customer.birthday);

  let massageHtml = '';
  currentFlow.analyze.solution.massages.forEach((item) => {
    massageHtml += `<div class="row-space-between px-10 py-10">
          <span class="ct flex1 text-left">${item.name}</span>
          <span class="ct flex1 text-left">次数：${item.count}次</span>
        </div>
        <div class="row-space-between px-10 py-10">
          <span class="ct text-left">备注：</span>
          <span class="ct flex1 text-left ml-30">
            ${item.remark || '未设置'}
          </span>
        </div>`;
  });

  let applicationHtml = '';
  currentFlow.analyze.solution.applications.forEach((item) => {
    applicationHtml += `<div class="row-space-between px-10 py-10 mt-20">
          <span class="ct flex1 text-left">${item.name}</span>
          <span class="ct flex1 text-left">贴数：${item.acupoint}贴</span>
        </div>
        <div class="column px-10 py-10">
          <span class="ct flex1 text-left mt-10">
            穴位：${item.acupoint || '未设置'}
          </span>
        </div>
      </div>`;
  });
  const getPrintHtml = () => {
    return `<html>
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />
    <style>
      td,
      th {
        border: 1px solid #666;
        padding: 10px;
      }

      td {
        color: #333;
        font-size: 10px;
        text-align: center;
      }

      table {
        border-collapse: collapse;
        border: 1px solid #666;
        letter-spacing: 1px;
      }

      .ct {
        color: '#333';
        font-size: 10px;
      }
      .column {
        display: flex;
        flex-direction: column;
      }
      .row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      .ml-30 {
        margin-left: 30px;
      }
      .mt-20 {
        margin-top: 20px;
      }
      .mt-10 {
        margin-top: 10px;
      }
      .flex1 {
        flex: 1;
      }
      .text-left {
        text-align: left;
      }
      .row-space-between {
        display: flex;
        justify-content: space-between;
      }
      .px-10 {
        padding: 0 10px;
      }
      .py-10 {
        padding: 10px 0;
      }
      .w-100 {
        width: 100%;
      }
      .line {
        height: 1px;
        width: 100px;
        background-color: #333;
        -webkit-print-color-adjust: exact;
      }
    </style>
  </head>
  <body style="text-align: center; padding: 20px 12px 12px 10px">
    <div>
      <h1 style="font-size: 16px; color: #000; font-weight: 600">
        掌阅未来小儿推拿调理方案
      </h1>
      <div class="row-space-between px-10 py-10">
        <span class="ct">理疗时间: ${currentFlow.updatedAt}</span>
        <span class="ct">项目单号: ${
          currentFlow.projectId || currentFlow._id
        }</span>
      </div>
      <table class="w-100">
        <tbody>
          <tr>
            <td>姓名：${currentFlow.customer.name}</td>
            <td>性别：${currentFlow.customer.gender ? '男' : '女'}</td>
            <td>年龄：${age?.year}岁${age?.month}月</td>
          </tr>
          <tr>
            <td>电话：${currentFlow.customer.phoneNumber}</td>
            <td colspan="2">过敏原：${
              currentFlow.collect.healthInfo.allergy
            }</td>
          </tr>
          <tr>
            <td colspan="3">
              调理导向：${currentFlow.collect.guidance || '未设置'}
            </td>
          </tr>
          <tr>
            <td colspan="3">
              注意事项：${currentFlow.analyze.remark || '未设置'}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="px-10 py-10 ct">
        <div
          style="
            text-align: left;
            color: #000;
            margin-top: 10px;
            font-weight: 600;
          "
        >
          理疗方案
        </div>
        ${massageHtml}
        ${applicationHtml}
    </div>
    <div
      style="bottom: 20px; position: fixed; left: 0; width: 100%; bottom: 10px"
    >
      <div
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          width: 100%;
        "
      >
        <div class="line"></div>
        <div class="ct" style="font-size: 8px; margin: 0 15px">温馨提示</div>
        <div class="line"></div>
      </div>
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 6px;
        "
      >
        <div
          style="width: 90%; display: flex; text-align: left; color: #000"
          class="ct"
        >
          小儿推拿仅限于为健康或亚健康儿童提供推拿保健服务，不属于医疗行为，如以治疗为目的，需要到正规医疗机构，在专业医师的指导下进行.由于个人体质不同，调理结果因人而异，敬请理解。
        </div>
      </div>
    </div>
  </body>
</html>`;
  };

  const print = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: getPrintHtml(),
      orientation: Print.Orientation.portrait,
      width: 595,
      height: 842,
    });
  };

  return (
    <Pressable
      hitSlop={ss(10)}
      onPress={() => {
        print();
      }}
    >
      <Row bgColor={'white'} borderRadius={4} px={ls(26)} py={ss(10)}>
        <Text color={'#03CBB2'} fontSize={sp(14, { min: 12 })}>
          打印
        </Text>
      </Row>
    </Pressable>
  );
}
