"use client";
import Navbar from "@/components/navbar";
import {
  gymSmartAccount,
  gymUserFee,
  gymUserMaxCashbackPercentage,
  ISETHABI,
  SuperETHAddress,
} from "@/lib/constants";
import { parseEther } from "viem";
import { useBalance, useWalletClient } from "wagmi";

export default function User() {
  // const { smartAccountClient } = usePimlico();
  const { data: walletClient } = useWalletClient();
  console.log("walletClient", walletClient);

  const ethBalance = useBalance({
    address: walletClient?.account.address,
  });

  // const [userAccount, setUserAccount] = useState<`0x${string}` | undefined>(
  //   undefined
  // );

  // useEffect(() => {
  //   setUserAccount(walletClient?.account.address);
  // }, [walletClient?.account]);

  /**
   * Handle user monthly deposit
   * it needs to perform 2 transactions:
   * 1. transfer an x% of the fee to the gym account
   * 2. transfer the rest using the SuperToken contract
   */
  async function handleUserMonthlyDeposit() {
    const transactionHash = await walletClient?.sendTransaction({
      to: gymSmartAccount,
      value: parseEther(
        (gymUserFee * (1 - gymUserMaxCashbackPercentage)).toString()
      ),
    });
    console.log("tx1 - transactionHash", transactionHash);
    const contractResult = await walletClient?.writeContract({
      address: SuperETHAddress,
      abi: ISETHABI,
      // chain: sepolia,
      functionName: "upgradeByETHTo",
      args: [gymSmartAccount],
      value: parseEther((gymUserFee * gymUserMaxCashbackPercentage).toString()),
    });
    console.log("tx2 - contractResult", contractResult);
  }

  console.log("ethBalance", ethBalance);

  return (
    <div className="w-full h-full">
      <Navbar />
      <h1>Pay your month subscription</h1>
      <h2>ETH Balance</h2>
      <code>
        {`
            Amount: ${ethBalance.data?.value}
            Decimals: ${ethBalance?.data?.decimals}
            Symbol: ${ethBalance?.data?.symbol}
          `}
      </code>
      <p>Amount to pay: {gymUserFee} ETH</p>
      <p>Max cashback value: {gymUserFee * gymUserMaxCashbackPercentage}</p>
      <p>Max cashback (%): {gymUserMaxCashbackPercentage * 100}%</p>
      <button onClick={handleUserMonthlyDeposit}>Deposit</button>
    </div>
  );
}
