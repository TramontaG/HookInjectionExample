import veryBigJson from './schedules-diego-2021-10-28.json';

const getData = () => {
  return veryBigJson as any[];
};

const splitWolAndLiveSells = (salesArr: any[]) =>
  salesArr.reduce(
    (acc: {wol: any[]; live: any[]}, current: {product_name: string}) => {
      if (current.product_name === 'wol') {
        acc.wol.push(current);
      } else {
        acc.live.push(current);
      }

      return acc;
    },
    {
      wol: [],
      live: [],
    },
  );

const splitWolAndLiveCommisions = (salesArr: any[]) => {
  let comissions = {
    wol: new Array(),
    live: new Array(),
  };

  for (let i = 0; i < salesArr.length; i++) {
    const liveCommissions = salesArr[i].sales.filter(
      (sale: any) => sale.product_name !== 'Wise Up Online',
    );
    const wolCommissions = salesArr[i].sales.filter(
      (sale: any) => sale.product_name == 'Wise Up Online',
    );

    if (liveCommissions.length > 0) {
      comissions.live.push({
        ...salesArr[i],
        amount: liveCommissions.reduce(
          (acc: number, {amount}: {amount: number}) => (acc += amount),
          0,
        ),
        sales: liveCommissions,
      });
    }

    if (wolCommissions.length > 0) {
      comissions.wol.push({
        ...salesArr[i],
        amount: wolCommissions.reduce(
          (acc: number, {amount}: {amount: number}) => (acc += amount),
          0,
        ),
        sales: wolCommissions,
      });
    }
  }

  return comissions;
};

const formatSchedules = (schedule: any[]) =>
  schedule.map((schedule: any) => {
    const wolAndLiveSales = splitWolAndLiveSells(schedule.sales);

    const splitwolAndLiveCommissions = splitWolAndLiveCommisions(
      schedule.commissions,
    );

    return {
      ...schedule,
      sales: wolAndLiveSales,
      commissions: splitwolAndLiveCommissions,
    };
  });

export default () => formatSchedules(getData().content.instance.schedules);
