import {ScrollView} from "react-native";

import WalletHeader from "@/components/wallet-header";
import Deposit from "@/components/deposit";
import Withdraw from "@/components/withdraw";
import Transactions from "@/components/transactions";

const Wallet = () => {
  return (
    <ScrollView>
      <WalletHeader />
      <Deposit />
      <Withdraw />
      <Transactions />
    </ScrollView>
  );
};

export default Wallet;
