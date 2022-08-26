type FirstHook<T> = (intialProps: any) => T;
type Pipeline<T> = ((obj: T) => T)[];

const useLogic =
  <T>(
    initialHook: FirstHook<T>,
    pipeline: Pipeline<ReturnType<typeof initialHook>>,
  ) =>
  (initialProps: any) => {
    let result = initialHook(initialProps);

    pipeline.forEach(hook => {
      result = hook(result);
    });

    return result;
  };

export default useLogic;

useLogic(() => ({a: 1}), [({a: number}) => ({a: 2})] )