interface IPaddingParam {
  size: number;
}

/**
 * Add padding into the page
 */
export function Padding(param: IPaddingParam) {
  return (
    <div
      className="flex-1"
      style={{
        height: `${param.size}px`,
      }}
    ></div>
  );
}
