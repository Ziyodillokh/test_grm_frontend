export const  formatNumber = (num:number) => {
    const parts = num.toFixed(2).split(".");
    const integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${integer}.${parts[1]}`;
  };