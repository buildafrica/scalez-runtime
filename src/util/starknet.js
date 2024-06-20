import { RpcProvider, shortString, num, Contract } from "starknet";
  
const messageContractAddress =
"0x6b7331232ca3bf34effacd7e68bf87728fbbd063f73c219b42aff07535457e";

const rpc_provider = new RpcProvider({
nodeUrl:
  "https://starknet-goerli.g.alchemy.com/v2/cmootBfOhD5Yjs5hTaEY3hf5PlFabEO_",
});



const message_abi = [
  {
      "name": "MessageImpl",
      "type": "impl",
      "interface_name": "mu_hack::message::IMessage"
  },
  {
      "name": "core::byte_array::ByteArray",
      "type": "struct",
      "members": [
          {
              "name": "data",
              "type": "core::array::Array::<core::bytes_31::bytes31>"
          },
          {
              "name": "pending_word",
              "type": "core::felt252"
          },
          {
              "name": "pending_word_len",
              "type": "core::integer::u32"
          }
      ]
  },
  {
      "name": "mu_hack::message::IMessage",
      "type": "interface",
      "items": [
          {
              "name": "send_message",
              "type": "function",
              "inputs": [
                  {
                      "name": "message",
                      "type": "core::byte_array::ByteArray"
                  }
              ],
              "outputs": [],
              "state_mutability": "external"
          },
          {
              "name": "get_message",
              "type": "function",
              "inputs": [],
              "outputs": [
                  {
                      "type": "core::byte_array::ByteArray"
                  }
              ],
              "state_mutability": "view"
          }
      ]
  },
  {
      "kind": "enum",
      "name": "mu_hack::message::Message::Event",
      "type": "event",
      "variants": []
  }
]


export function byteArrayFromStr(str) {
  if (str.length === 0) {
      return {
          data: ['0x00'],
          pending_word: '0x00',
          pending_word_len: 0
      }
  }
  const myShortStrings = shortString.splitLongString(str);
  const remains = myShortStrings[myShortStrings.length - 1];
  const myShortStringsEncoded = myShortStrings.map(
      (shortStr) => shortString.encodeShortString(shortStr)
  );
  if (remains.length === 31) {
      return {
          data: myShortStringsEncoded,
          pending_word: '0x00',
          pending_word_len: 0
      }
  }
  const pendingEncodedWord = myShortStringsEncoded.pop();
  return {
      data: myShortStringsEncoded.length === 0 ? ["0x00"] : myShortStringsEncoded,
      pending_word: pendingEncodedWord,
      pending_word_len: remains.length
  }
}

export function stringFromByteArray(myByteArray) {
  const pending_word = BigInt(myByteArray.pending_word) === 0n ? '' : shortString.decodeShortString(num.toHex(myByteArray.pending_word));
  return myByteArray.data.reduce<string>(
      (cumuledString, encodedString) => {
          const add = BigInt(encodedString) === 0n ? '' : shortString.decodeShortString(num.toHex(encodedString));
          return cumuledString + add
      }
      , ""
  ) + pending_word;
}

export const messageContract = new Contract(
  message_abi,
  messageContractAddress,
  rpc_provider,
);
  