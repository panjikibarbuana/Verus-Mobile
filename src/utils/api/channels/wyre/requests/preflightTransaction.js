import BigNumber from "bignumber.js"
import WyreProvider from "../../../../services/WyreProvider"
import WyreService from "../../../../services/WyreService"

export const txPreflight = async (coinObj, activeUser, address, amount, params) => {
  try {
    const res = await WyreProvider.preflightTransaction({
      source: WyreProvider.getAccountSrn(),
      sourceCurrency: coinObj.id,
      sourceAmount: amount.toString(),
      dest: WyreService.formatCryptoSrn(coinObj, address),
      destCurrency: coinObj.id,
      message: params.memo
    })
    
    return {
      err: false,
      result: {
        fee: res.totalFees != null ? res.totalFees.toString() : "0",
        value: res.destAmount.toString(),
        toAddress: address,
        fromAddress: `Wyre ${coinObj.id} wallet`,
        amountSubmitted: amount.toString(),
        balanceDelta: BigNumber(res.sourceAmount).multipliedBy(-1),
        memo: res.message,
        params: {
          transferId: res.id,
        },
      },
    };
  } catch(e) {
    console.error(e)

    return {
      err: true,
      result: e.message
    }
  }
}