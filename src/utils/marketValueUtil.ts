export const getMarketValueString = (obj: any) => {

    const average = obj.average;
    const max = obj.max;
    const min = obj.min;

    const marketValue = `Average: ${parseFloat(average).toLocaleString(
        "en-US",
        {
            style: "currency",
            currency: "EGP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }
    )}, Max: ${parseFloat(max).toLocaleString("en-US", {
        style: "currency",
        currency: "EGP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}, Min: ${parseFloat(min).toLocaleString("en-US", {
        style: "currency",
        currency: "EGP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })}`;
    return marketValue;
}