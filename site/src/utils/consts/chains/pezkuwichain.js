// PezkuwiChain mainnet relay chain config for Statescan
// Params: ss58=42, HEZ token, 12 decimals, RPC wss://rpc.pezkuwichain.io
import { governanceModules, treasuryModules } from "./modules";

const pezkuwichain = {
  name: "Pezkuwi",
  identity: "pezkuwi",
  sub: "pezkuwi",
  value: "pezkuwi",
  chain: "pezkuwi",
  symbol: "HEZ",
  decimals: 12,
  ss58Format: 42,
  buttonColor: "#1B8E3D",
  primaryColor: "#1B8E3D",
  modules: {
    ...treasuryModules,
    ...governanceModules,
    identity: true,
    multisig: true,
    vestings: true,
    proxy: true,
    staking: { rewards: true },
  },
  nodes: [
    { name: "Pezkuwichain", url: "wss://rpc.pezkuwichain.io" },
    { name: "Pezkuwichain (mainnet)", url: "wss://mainnet.pezkuwichain.io" },
  ],
};

export default pezkuwichain;
