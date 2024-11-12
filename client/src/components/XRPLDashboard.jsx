import React, { useState } from "react";
import { Client, AccountSetAsfFlags, AccountSetTfFlags } from "xrpl";

const XRPLTokenIssuer = () => {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [wallets, setWallets] = useState({
    hot: null,
    cold: null,
    customerOne: null,
    customerTwo: null,
  });
  const [balances, setBalances] = useState({
    hot: null,
    cold: null,
  });

  const updateStatus = (message) => {
    setStatus((prev) => prev + "\n" + message);
  };

  const handleError = (error) => {
    setError(error.message || String(error));
    setIsProcessing(false);
  };

  const issueToken = async () => {
    setIsProcessing(true);
    setStatus("");
    setError("");

    try {
      const client = new Client("wss://s.altnet.rippletest.net:51233");
      updateStatus("Connecting to Testnet...");
      await client.connect();

      // Get credentials from the Testnet Faucet
      updateStatus("Requesting addresses from the Testnet faucet...");
      const hot_wallet = (await client.fundWallet()).wallet;
      const cold_wallet = (await client.fundWallet()).wallet;
      const customer_one_wallet = (await client.fundWallet()).wallet;
      const customer_two_wallet = (await client.fundWallet()).wallet;

      setWallets({
        hot: hot_wallet,
        cold: cold_wallet,
        customerOne: customer_one_wallet,
        customerTwo: customer_two_wallet,
      });

      // Configure cold address settings
      const cold_settings_tx = {
        TransactionType: "AccountSet",
        Account: cold_wallet.address,
        TransferRate: 0,
        TickSize: 5,
        Domain: "6578616D706C652E636F6D",
        SetFlag: AccountSetAsfFlags.asfDefaultRipple,
        Flags:
          AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag,
      };

      const cst_prepared = await client.autofill(cold_settings_tx);
      const cst_signed = cold_wallet.sign(cst_prepared);
      updateStatus("Sending cold address AccountSet transaction...");
      const cst_result = await client.submitAndWait(cst_signed.tx_blob);

      // Configure hot address settings
      const hot_settings_tx = {
        TransactionType: "AccountSet",
        Account: hot_wallet.address,
        Domain: "6578616D706C652E636F6D",
        SetFlag: AccountSetAsfFlags.asfRequireAuth,
        Flags:
          AccountSetTfFlags.tfDisallowXRP | AccountSetTfFlags.tfRequireDestTag,
      };

      const hst_prepared = await client.autofill(hot_settings_tx);
      const hst_signed = hot_wallet.sign(hst_prepared);
      updateStatus("Sending hot address AccountSet transaction...");
      await client.submitAndWait(hst_signed.tx_blob);

      // Create trust lines
      const currency_code = "FOO";
      const createTrustLine = async (wallet, toAddress) => {
        const trust_set_tx = {
          TransactionType: "TrustSet",
          Account: wallet.address,
          LimitAmount: {
            currency: currency_code,
            issuer: cold_wallet.address,
            value: "10000000000",
          },
        };

        const prepared = await client.autofill(trust_set_tx);
        const signed = wallet.sign(prepared);
        updateStatus(`Creating trust line from ${wallet.address} to issuer...`);
        await client.submitAndWait(signed.tx_blob);
      };

      await createTrustLine(hot_wallet, cold_wallet.address);
      await createTrustLine(customer_one_wallet, cold_wallet.address);
      await createTrustLine(customer_two_wallet, cold_wallet.address);

      // Send tokens
      const sendTokens = async (from, to, amount) => {
        const send_token_tx = {
          TransactionType: "Payment",
          Account: from.address,
          Amount: {
            currency: currency_code,
            value: amount,
            issuer: cold_wallet.address,
          },
          Destination: to.address,
          DestinationTag: 1,
        };

        const prepared = await client.autofill(send_token_tx);
        const signed = from.sign(prepared);
        updateStatus(
          `Sending ${amount} ${currency_code} from ${from.address} to ${to.address}...`
        );
        await client.submitAndWait(signed.tx_blob);
      };

      await sendTokens(cold_wallet, hot_wallet, "3800");
      await sendTokens(hot_wallet, customer_one_wallet, "100");
      await sendTokens(customer_one_wallet, customer_two_wallet, "12");

      // Check balances
      const hot_balances = await client.request({
        command: "account_lines",
        account: hot_wallet.address,
        ledger_index: "validated",
      });

      const cold_balances = await client.request({
        command: "gateway_balances",
        account: cold_wallet.address,
        ledger_index: "validated",
        hotwallet: [hot_wallet.address],
      });

      setBalances({
        hot: hot_balances.result,
        cold: cold_balances.result,
      });

      updateStatus("Token issuance completed successfully!");
      await client.disconnect();
    } catch (err) {
      handleError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            XRPL Token Issuer
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <button
            onClick={issueToken}
            disabled={isProcessing}
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
          >
            {isProcessing ? "Processing..." : "Issue Token"}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {status && (
            <div className="font-mono text-sm bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
              {status}
            </div>
          )}

          {balances.hot && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Hot Wallet Balances
              </h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(balances.hot, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {balances.cold && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Cold Wallet Balances
              </h3>
              <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                <pre className="text-sm text-gray-700">
                  {JSON.stringify(balances.cold, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default XRPLTokenIssuer;
